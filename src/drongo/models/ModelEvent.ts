


export class ModelEvent
{
    public static VALUE_CHANGED:string="ModelEvent.VALUE_CHANGED";
	
    public static ADD_CHILD:string="ModelEvent.ADD_CHILD";
    
    public static REMOVE_CHILD:string="ModelEvent.REMOVE_CHILD";
    
    public static CHILD_VALUE_CHANGED:string="ModelEvent.CHILD_VALUE_CHANGED";

    public key:string;
    public newValue:any;
    public oldValue:any;

    constructor(){

    }

    public static Create(newValue?:any,oldValue?:any,key?:string):ModelEvent{
        let result:ModelEvent=new ModelEvent();
        result.oldValue=oldValue;
        result.newValue=newValue;
        result.key=key;
        return result;
    }
}