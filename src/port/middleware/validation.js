
import joi from 'joi';
import { Schema } from 'mongoose';

export const registervalidate =(req,res,next)=>
{
    const validregschema =Joi.object({
      name:Joi.string().min(2).required(),
      email:Joi.string().email().required(),
      phone :joi.string().min(9).max(10).required(),
      password :Joi.string().min(8).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required()

    });

    const {error } = validregschema.validate(req.body);
    if(error)
    {
        return res.status(400).json({
            error:error.details[0].message
        });
        next();
    };
};
    export const loginvalidate =(req,res,next)=>{
const loginvalidschema =joi.object({
    email :Joi.string().email().required(),
    password :Joi.string().min(6).required(),
});

const {error} =loginvalidschema.validate(req.body);
if(error)
{
    return res.status(400).json({error:error.details[0].message});
    next();
}

};
