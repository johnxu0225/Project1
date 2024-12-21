package com.revature.aspects;

//This is a custom annotation!
//We can use it to annotate any controller method that can only be accessed by managers

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) //This annotation can only be used over methods
@Retention(RetentionPolicy.RUNTIME) //This annotation will be available at runtim
public @interface AdminOnly {

    //No need for fields/methods etc.

}