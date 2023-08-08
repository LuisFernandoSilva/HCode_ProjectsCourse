class calcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._locale = 'pt-BR';
        this._operation = [];
        //coloque a informaçao em html
        this._displayCalcEl = document.querySelector("#display");//el para dizer que e o elemento
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");        
        this._currentDate; //privado
        this.initialize();
        this.initButtonsEvents();
        this.initiKeyBoard();
    }

    initialize(){

        this.setDisplayDateTime();
        //para atualizar  a hora em determinado tempo
        setInterval(
            ()=>{

                this.setDisplayDateTime();

            },1000 );

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('btn-ac').forEach(btn=>{
            btn.addEventListener('dbclick', e=>{
                this.toggleAudio();
            });
        });

      
    }

    toggleAudio(){

        if (this._audioOff) {
            this._audioOff=false;
        } else {
            this._audioOff=true;
        }
    }

    playAudio(){
        if (this._audioOff) {
            this._audio.currentTime =0;
            this._audio.play();
        }

    }

    pasteFromClipBoard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }
    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    initiKeyBoard(){
        document.addEventListener('keyup',e=>{
            this._audio.play();
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break; 
                case '+':
                case '-':   
                case '*':
                case '/':
                case '%':     
                    this.addOperator(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':    
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperator(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) {
                        this.copyToClipBoard();
                    }
                break;
    
                default:
                    this.setError();
                    break;
            }



        });
    }
    

    addEventListenerAll(element, events, fn){
        //converte um string em array, fazendo o for each em cada element e adicionando um event, sendo o false para nao
        //acontecer de os events nao ocorrer ao mesmo tempo
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation=[];
        this._lastOperator = '';
        this._lastNumber = '';
        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();
        
       this.setLastNumberToDisplay();

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];

    }
    isOperator(value){
        //verifica se um operador e retorna um true ou false
       return (['+','-','*','%','/'].indexOf(value) > -1);

    }

    setLastOperation(value){
        //adiciona no ultimo item do array o operador
        return this._operation[this._operation.length -1]= value;
    }

    pushOperator(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            
            this.calc();
        }

    }

    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (error) {
            setTimeout(()=>{
                this.setError();
            },1);
            
        }
        
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastOperation();

        if (this._operation < 3) {
            let firstItem = this._operation[0];
            this._operation=[firstItem, this._lastOperator, this._lastNumber];
        }

       if (this._operation.length > 3) {
        last = this._operation.pop();
        
        this._lastNumber = this.getResult();

       } else if(this._operation.length == 3){
        
        this._lastNumber = this.getLastOperation(false);

       }
       
       let result = this.getResult();
       if (last=='%') {
        result= result / 100;
        this._operation[result];
       }else{
        
        this._operation = [result];
        if (last) {
            this._operation.push(last);
        }
       }

       this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--) {
            if (this.isOperator(this._operation[i])== isOperator) {
                lastItem = this._operation[i];
                break;
            }
            
        }
        if (!lastItem) {
            //if for true entao armazena o ultimo operador senao
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }


    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        if (!lastNumber) {
            lastNumber = 0;
        } 
        this.displayCalc = lastNumber;

    }

    addOperator(value){

        if (isNaN(this.getLastOperation())) {


            if (this.isOperator(value)) {
                //adiciona no ultimo item do array o operador
                this.setLastOperation(value);
            } else{
                this.pushOperator(value);
                this.setLastNumberToDisplay();
            }
            
        }else{

            if (this.isOperator(value)) {
                this.pushOperator(value);
            } else {
                let newValue= this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }


        }

        

    }

    setError(){
        this.displayCalc="Error";
    }

    addDot(){
      let lastOperation = this.getLastOperation();

      if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
        return;
      }  

      if (this.isOperator(lastOperation)|| !lastOperation) {
         this.pushOperator('0.');
        
      }else{
        this.setLastOperation(lastOperation.toString()+'.');
      }
      this.setLastNumberToDisplay();

    }
    

    execBtn(value){
        this._audio.play();
        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break; 
            case 'soma':
                this.addOperator('+');
                break;
            case 'subtracao':
                this.addOperator('-');
                break;
            case 'divisao':
                this.addOperator('/');
                break;
            case 'multiplicacao':
                this.addOperator('*');
                break;
            case 'porcento':
                this.addOperator('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperator(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){
        //seleciona todos as classes de buttons com o g do svg
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn,"click drag",e=>{
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });

        
        
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
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
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