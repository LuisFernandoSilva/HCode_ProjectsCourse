class calcController{

    constructor(){

        this._locale = 'pt-BR';
        //coloque a informaçao em html
        this._displayCalcEl = document.querySelector("#display");//el para dizer que e o elemento
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");        
        this._currentDate; //privado
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){

        this.setDisplayDateTime();
        //para atualizar  a hora em determinado tempo
        setInterval(
            ()=>{

                this.setDisplayDateTime();

            },1000 );
      
    }

    initButtonsEvents(){
        //seleciona todos as classes de buttons com o g do svg
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{
            btn.addEventListener('click',e=>{
                console.log(btn.className.baseVal.replace("btn-", ""));
            });
        })

        
        
    }

    //atualiza hora
    setDisplayDateTime(){

        this.displayDate=this.currentDate.toLocaleDateString(this._locale, {
            day:"2-digit",
            month:"long",
            year:"numeric"
        });
        this.displayTime=this.currentDate.toLocaleTimeString(this._locale);

    }


    //hora
    get displayTime(){
        return this._timeEl.innerHTML; 
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value; 
    }
    //data
    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value; 
    }
    //display de calcular
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML= value;
    }
    //data atual
    get currentDate(){
        return new Date();
    }
    
    set currentDate(value){
        this._currentDate= value;
    }

}