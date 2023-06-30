// import { useSession, signIn, signOut } from "next-auth/react";
import SendSMSForm from './sendSMSForm';
import C2BPayment from "./c2bForm";
import B2CForm from "./b2cForm";

export default function Component() {

    return (
    
<div>
          
          <SendSMSForm /><br></br>
          <C2BPayment /><br></br>
          <B2CForm /><br></br>

          </div>

    )  
  
    } 