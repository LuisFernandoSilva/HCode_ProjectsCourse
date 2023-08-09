class UserController{

    constructor(formIdCreate,formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", event=>{


            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]")

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];
            //mesclando os objetos
            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!values.photo){ 
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }
                    let user =new User();
                    user.loadFromJSON(result);
                    this.getTr(user,tr);

                    user.save();
                    this.updateCount();

                    this.formUpdateEl.reset();
            
                    this.showPanelCreate();

                    btn.disabled = false;

                }, 
                (e) => {
                    console.error(e)
                }
            );

        });


    
   
   
    }
    //metodo para enviar o formulario
    onSubmit(){

        //vai pegar o elemento no dom com esse id e vai ficar esperando o evento 
        //de submit do botao entao enviar o json de user com os campos do formulario
        //uso da arrow function para ter acesso ao scopo do que tiver de fora
        this.formEl.addEventListener("submit",  (event)=> {

            event.preventDefault();//cancela o evento default do formulario
            let value = this.getValues(this.formEl);
            let btn = this.formEl.querySelector("[type=submit");
            btn.disabled = true;
            if(!value){
                return false;
            }
            this.getPhoto(this.formEl).then(
                 (content)=> {
                    value.photo = content;
                    //this.insert(dataUser);
                    value.save();
                    this.addLine(value);
                    this.formEl.reset();
                    btn.disabled = false;
                },
                function (e) {
                    console.error(e);
                }
            );

            

        });
    }


    getPhoto(formEl){
        //promisse executa um processo assicrono em javascript, que ou faz algo ou o que fazer se isso nao der certo
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();
            //filtro no array para achar o path do arquivo da foto
            let elements = [...formEl.elements].filter(item=>{
                if (item.name === 'photo') {
                    return item;
                }
    
            });
            let file = elements[0].files[0];
            fileReader.onload= ()=>{
                resolve(fileReader.result);
            };
            fileReader.onerror = ()=>{
                reject(e);
            };
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve(`dist/img/boxed-bg.jpg`);
            }
            

        });

    }

    //pega os campos do formulario e retornar json
    getValues(formEl){
        let isValid = true;
        let user = {};
        //transforma a coleçao html em array para funcionar o for each e uso do spread para nao precisar declarar os indices
        [...formEl.elements].forEach(function (field, index) { 
            //validações no if valida se e maior que o menos do index do array para validar se esta vazio o campo nega para verificar se esta vazio
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.name){
                //o elemento pai do form e add uma nova classe
                field.parentElement.classlist.add('has-error');
                isValid= false;
            }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            }else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        

        });
        //confirma se o formulario esta valido
        if(!isValid){
            return false;
        }
        return new User(
            user.name, 
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
       
    }

    getUsersStorage(){
        let users=[];

        /**
         *  if(sesssionStorage.getItem("users")) {
            users= JSON.parse(localStorage.getItem("users"));
            }
         * 
         */    
        if (localStorage.getItem("users")) {
            users= JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }

    selectAll(){
        let users=this.getUsersStorage();
        users.forEach(dataUser=>{
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        });
    }

    insert(data){
        let users=this.getUsersStorage();

          
        users.push(data);

        localStorage.setItem("users",JSON.stringify(users));
       // localStorage.setItem("users",JSON.stringify(users));

    }


    getTr(dataUser, tr = null){
        if (tr=== null) {
            tr = document.createElement('tr');
        }
        tr.dataset.user = JSON.stringify(dataUser);
        //usar o innerHtml que pode se passar uma instrução html para variavel    
        //use o template string ``
        tr.innerHTML =`
        
            <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
      
          `;
         this.addEventsTr(tr);
        return tr;
    }

    addLine(dataUser) {
        let tr = this.getTr(dataUser);
        
        this.tableEl.appendChild(tr); 
        this.updateCount();
    
    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", (event)=>{
            if (confirm("deseja realmente excluir?")) {

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });



        tr.querySelector(".btn-edit").addEventListener("click", (event)=>{
            //usa o for in um laço de objetos para percorrer os dados do objeto json convertido o user
            let json = JSON.parse(tr.dataset.user);
           

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) {
               let field=     this.formUpdateEl.querySelector("[name="+name.replace("_","")+"]");

               if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                            
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name="+name.replace("_","")+ json[name]+"]");
                            field.checked = true;
                            break;  
                        case 'checkbox':
                            field.checked = json[name];
                            break;                              
                        
                        default:
                            field.value=json[name];
                            break;
                 }
               
               }
            }
            this.formUpdateEl.querySelector(".photo").src=json._photo;
            this.showPanelUpdate();

        });
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){
        let numberUsers= 0;
        let numberAdmin= 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) {
                numberAdmin++;
            }

        });

        document.querySelector("#number-users").innerHTML= numberUsers;
        document.querySelector("#number-users-admin").innerHTML= numberAdmin;
    }
}