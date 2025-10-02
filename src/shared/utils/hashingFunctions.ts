import * as bcrypt from 'bcrypt';
import { hashConstants } from 'src/common/constants/hash.constant';



export async function hashPassword(password:string):Promise<string>{
  try{
    const saltRounds=hashConstants.saltRounds;
    const hashedPassword=await bcrypt.hash(password,saltRounds);
    return hashedPassword;
  }
  catch(error){
    throw new Error('error hashing password: '+error.message);
  }
}

export async function comparePasswords(plainPassword:string,hashedPassword:string):Promise<boolean>{
  try{
    const isMatch=await bcrypt.compare(plainPassword,hashedPassword);
    return isMatch;
  }
  catch(error){
    throw new Error('error comparing passwords: '+error.message);
  }
}
