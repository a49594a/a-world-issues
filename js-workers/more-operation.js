function main(args) {
    var type = args.type;
    var num1 = args.num1;
    var num2 = args.num2;
    switch (type) {
        case "xor":
            return num1 ^ num2;
        case "and":
            return num1 & num2;
        case "or":
            return num1 | num2;
        case "not":
            return ~num1;
        default:
            return "Please input an operation!"
    }
}
onmessage = evt => postMessage(main(evt.data));
