import { IUser } from '../../interfaces/iuser';
import { HTTPRequest } from '../../utils/HTTPRequest';
import './signUpModal.css'
import { useState } from "react";

interface SignUpModalProps {
    onClose: () => void;
}

export default function SignUpModal(props: SignUpModalProps) {
    const [nameValue, setNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [adminValue, setAdminValue] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
      };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailValue(e.target.value);
      };
    
      const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(e.target.value);
      };
      const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(e.target.value);
      };
      const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setAdminValue(e.target.checked);
      };

    function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
      }

    async function compareCredentials() {
        const name = nameValue.trim();
        const email = emailValue.trim();
        const password = passwordValue.trim();
        const confirmPassword = confirmPasswordValue.trim();
        const admin = adminValue;
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            alert(`Favor preencher todos os campos de cadastro.`)   
        } else {
            if(confirmPassword === password) {
                const newUser =  { name: name, email: email, password: password, is_admin: admin};

                const response = await HTTPRequest("http://localhost:5000/createuser", "POST", newUser)
                if(response.status === 200)
                    alert('Novo atendente cadastrado com sucesso!');
                else
                    alert(`Algo deu errado no cadastro.`);
            }
            else 
                alert('As senhas devem ser iguais.')
            
        }
    }

    return(
        <div className='modal-background' onClick={props.onClose}>
            <div className='form-container' onClick={stopPropagation}>
                
                <form action="">
                    <div className="input-container">
                    <h2>Cadastro</h2>
                        <label htmlFor="name-input">Name: </label>
                        <input type="text" className='default-input' name="name-input" onChange={handleNameChange}/>
                        <label htmlFor="email-input">Email: </label>
                        <input type="text" className='default-input'  name="email-input" onChange={handleEmailChange}/>
                        <label htmlFor="password-input">Password: </label>
                        <input type="password" className='default-input' name="password-input" onChange={handlePasswordChange} />
                        <label htmlFor="confirm-password-input">Confirm password: </label>
                        <input type="password" className='default-input' name="confirm-password-input"onChange={handleConfirmPasswordChange}/>
                        <label htmlFor="admin-checkbox">Admin?</label>
                        <input type="checkbox" name='admin-checkbox'onChange={handleCheckboxChange}/>
                    </div>
                    <div className="button-container">
                        <button className='signup-button' type='button' onClick={compareCredentials}>
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>    
        </div>
    )
}