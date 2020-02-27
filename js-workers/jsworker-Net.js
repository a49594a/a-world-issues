/*2020.2.27 V2

anthor:lucky_lai 

I would say thanks to :

frank_782 , Forest_Park , Steve_xmh and Ye_Jun

*/

/*JSWorker main function*/
function main(args){
    try{
        switch(args.action){
            case "init":
                this.input = args.input;/* Use "this" in V2 */
                this.output = args.output;
                this.hidden = args.hidden;
                this.speed = args.speed;
                this.weight1 = initWeight(this.input,this.hidden);
                this.weight2 = initWeight(this.hidden,this.output);
                this.inputValue = initArray(this.input);
                this.hiddenValue = initArray(this.hidden);
                this.outputValue = initArray(this.output);
                this.outputValueExpect = args.outputValueExpect;
                this.action = "train";
                var config = {
                    action:this.action,
                    inputValue:this.inputValue,
                    outputValueExpect:this.outputValueExpect,
                    error:""
                }
                return config
            case "train":
                this.inputValue = args.inputValue;
                this.hiddenValue = initArray(this.hidden);
                this.outputValue = initArray(this.output);
                this.outputValueExpect = args.outputValueExpect;
                this.action = "train";
                if(!this.outputValueExpect.length||!this.weight1.length||!this.weight2.length
                    ||!this.inputValue.length)return {"error":"Some arrays are empty."}
                    /*V1: Fixed here*/
                forward(this);
                backward(this);
                var config = {
                    action:this.action,
                    outputValue:this,outputValue,
                    error:""
                }
                return config;
            case "speed":
                this.speed = args.speed;
                this.action = "train";
                var config = {
                    action:this.action,
                    outputValue:this,outputValue,
                    error:""
                }
                return config;
        }

    }catch(err){
        return {error:"Runtime Error."}
    }
}






/*Init a random matrix with size inp*oup */
function initWeight(inp,oup){
    var weight = new Array(inp);
    for(var i = 0 ; i < inp ; i++){
        weight[i] = new Array(oup);
        for(var j = 0; j < oup ; j++)weight[i][j]=Math.random();
    }
    return weight;
}
/*Init a 0 Array of "length" length*/
function initArray(length){
    var array = new Array(length);
    for(var i = 0 ; i < length ; i++){
        array[i] = 0;
    }
    return array;
}
/*Sigmoid function*/
function sigmoid(x){
    return 1 / (1 + Math.exp(-x));
}
/*Sigmon's derivative*/
function sigmoidPrime(x){
    return x * (1 - x);
}
/*Network forward*/
function forward(self){
    self.hiddenValue = initArray(self.hidden);
    self.outputValue = initArray(self.output);
    for(var i = 0 ; i < self.input;i++){
        for(var j = 0 ; j < self.hidden;j++){
            self.hiddenValue[j] += self.inputValue[i]*self.weight1[i][j];
        }
    }
    for(var i = 0 ; i < self.hidden ; i++)self.hiddenValue[i]=sigmoid(self.hiddenValue[i]);
    for(var i = 0 ; i < self.hidden ; i++){
        for(var j = 0;j < self.output;j++){
            self.outputValue[j]+=self.hiddenValue[i]*self.weight2[i][j];
        }
    }
    for(var i = 0; i < self.output;i++)self.outputValue[i]=sigmoid(self.outputValue[i]);
    return;
}
/*Network backward*/
function backward(self){
    var error1 = [];/*Do not init them like : var error1 = error2 = []*/
    var delta1 = [];
    var error2 = [];
    var delta2 = [];
    for(var i = 0;i < self.output; i++){
        error1.push(self.outputValueExpect[i]-self.outputValue[i]);
        delta1.push(error1[i]*sigmoidPrime(self.outputValue[i]));
    }
    var turnedWeight2 = turnMatrix(self.weight2);
    error2 = arrayDot(delta1,turnedWeight2);
    for(var i = 0;i < self.hidden;i++)delta2.push(error2[i]*sigmoidPrime(self.hiddenValue[i]));
    for(var i = 0;i < self.inputValue;i++){
        for(var j = 0; j < self.hidden; j++)
        self.weight1[i][j]+=self.speed*self.inputValue[i]*delta2[j];
    }
    for(var i = 0; i < self.hidden;i++){
        for(var j = 0; j < self.output;j++)
        self.weight2[i][j]+=self.speed*self.hiddenValue[i]*delta1[j];
    }


    return;
}
/*Turn a Matrix*/
function turnMatrix(array){
    var x = array.length;
    var y = array[0].length;
    var array2 = initWeight(y,x)
    for(var i = 0 ; i < y ; i++){
        for(var j = 0 ; j < x; j++)array2[i][j]=array[j][i]
    }
    return array2;
}


/* Matrix dot with a Column matrix and a simple matrix */
function arrayDot(array1,array2){
    var array = initArray(array2[0].length);
    for(var i = 0 ; i < array2.length;i++){
        for(var j = 0; j < array2[0].length;j++)array[j]+=array1[i]*array2[i][j]
    }
    return array;
}



///* V1 */
//function testFunction1() {/* V1: Stuck here becase of the Array "outputValueExpect" */
//    /*It works here*/
//    var network = main({"input":"4","output":"4","speed":"1","hidden":"8","action":"init","outputValueExpect":[],"inputValue":[0,0,0,0],"weight1":[[0.40354305786332345,0.43711884944299584,0.09179569773269325,0.6426890921421813,0.7539277612115192,0.9884920830587489,0.4500227343380021,0.7556726109667422],[0.8388655655886612,0.9654633854019483,0.398082407423924,0.7059717357532838,0.43847544557808504,0.07045946575225748,0.44034410386684764,0.4095180083056167],[0.9120831420041495,0.9534148526051207,0.4575022945399021,0.4384717872377397,0.916123382584348,0.14378985691203727,0.4371103801212739,0.5348612981716783],[0.8927767293201567,0.422586441184148,0.4606164681191962,0.4396082653228448,0.820920925250918,0.37804660313495897,0.11012300048817347,0.12303523884053202]],"weight2":[[0.6352856913220923,0.6183761523872207,0.37279085978086046,0.8192460614238977],[0.3408695280492824,0.09997220310948585,0.08562676387279078,0.7926922769138558],[0.4065444129908533,0.953973214508417,0.9711809627401857,0.8283047492787412],[0.4665830563271647,0.938015380575365,0.3692694724741741,0.30862997550093185],[0.6632988118941925,0.7800820029745787,0.5994405704739152,0.8083900884759301],[0.4117424780881098,0.3046737808801463,0.5524930553089051,0.7662221215004259],[0.679479228633568,0.2362175386762122,0.5704629437587816,0.7327364785120778],[0.15414703587061362,0.15985902587723277,0.6849987063446856,0.44516980195192124]]});
//    /*                                                                                                   ^  */
//    /*                                                                                                  Here*/
//    /*So , It stucks */
//    network = main(network);/*Tthe Array "weight2" was filled with NaN */
//   console.log(network);
//}

///* V2 */
//function testFunction2(){
//    var network = main({"input":"4","output":"4","speed":"1","hidden":"8","action":"init","outputValueExpect":[1,0,0,0.5],"inputValue":[0,0,0,0],"weight1":[[0.40354305786332345,0.43711884944299584,0.09179569773269325,0.6426890921421813,0.7539277612115192,0.9884920830587489,0.4500227343380021,0.7556726109667422],[0.8388655655886612,0.9654633854019483,0.398082407423924,0.7059717357532838,0.43847544557808504,0.07045946575225748,0.44034410386684764,0.4095180083056167],[0.9120831420041495,0.9534148526051207,0.4575022945399021,0.4384717872377397,0.916123382584348,0.14378985691203727,0.4371103801212739,0.5348612981716783],[0.8927767293201567,0.422586441184148,0.4606164681191962,0.4396082653228448,0.820920925250918,0.37804660313495897,0.11012300048817347,0.12303523884053202]],"weight2":[[0.6352856913220923,0.6183761523872207,0.37279085978086046,0.8192460614238977],[0.3408695280492824,0.09997220310948585,0.08562676387279078,0.7926922769138558],[0.4065444129908533,0.953973214508417,0.9711809627401857,0.8283047492787412],[0.4665830563271647,0.938015380575365,0.3692694724741741,0.30862997550093185],[0.6632988118941925,0.7800820029745787,0.5994405704739152,0.8083900884759301],[0.4117424780881098,0.3046737808801463,0.5524930553089051,0.7662221215004259],[0.679479228633568,0.2362175386762122,0.5704629437587816,0.7327364785120778],[0.15414703587061362,0.15985902587723277,0.6849987063446856,0.44516980195192124]]})
//    response = main(network) 
//      /* Some variables were in "main" function ,
//      users can call this function with inputValue , outputValueExpert and 
//      action only after init.
//      */
//    main({"action":"speed","speed":1})
//      /*Use "speed" action to change the train speed by arg "speed"*/
//}

