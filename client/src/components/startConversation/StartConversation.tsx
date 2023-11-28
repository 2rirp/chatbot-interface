import "./startConversation.css"
import { Input } from "@mui/material";
import { useState } from "react"


interface IData {
    templateName: string;
    userId: string;
    content: string,
}

interface newConversationProps {
    attendantName: string;
    attendantRole: string;
    onClick: (data: IData) => void;
}
function StartConversation(props: newConversationProps) {
    // const [userName, setUserName] = useState("");
    // const [prenotation, setPrenotation] = useState("");
    // const [documents, setDocuments] = useState("");
    const [data, setData] = useState({ 
            templateName: 'default',
            userId: '',
            content: 'Deseja falar conosco para esclarecimentos e informações sobre seu registro ou certidões?' 
        }
    );
    
const handleSubmit = () => {
    if(data.userId.trim() !== '' ) {
        
        props.onClick(data);
    } else {
        console.log("TA FALTANDO")
    }
}
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(e.target.name === "userId") {
       const value =  e.target.value.replace(/[^\d]/g, "")        
        
        setData((prevData) => ({ ...prevData, [name]: value }));
    }
    else {
        setData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    console.log(data)
  };

  

  return (
        <div className="main-container">
            <h1>Iniciar nova conversa</h1>
            <div>
                <label htmlFor="">+55</label>
                <Input placeholder="Whatsapp"
                    name="userId"
                    value={data.userId}
                    onChange={handleInputChange}
                    required   />
                </div>
            <div className="secondary-container">
                <div className="default-container">
                    <label htmlFor="">Mensagem padrão</label>
                    <p>Deseja falar conosco para esclarecimentos e informações sobre seu registro ou certidões?</p>
                    <button name="default" onClick={handleSubmit}>Enviar</button>
                </div>
            {/* <div className="message-container">
            
                <label htmlFor="">Aguardando documentos</label>
                <p><Input placeholder="Nome Apresentante"
                value={userName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUserName(event.target.value);
                  }}
                  
                />, sou {props.attendantName}, {props.attendantRole} do 2º Registro de Imóveis. Prenotação nº 
                <Input placeholder="Numero Prenotação"
                type="number"
                value={prenotation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPrenotation(event.target.value);
                  }}
                />.
Para continuar a análise do seu título, preciso que me envie 
                <Input placeholder="Documentos"
                value={documents}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDocuments(event.target.value);
                  }}/> .
Para adiantar, envie a informação ou foto de boa qualidade do documento para eu verificar se será suficiente.</p>
<button name="default" onClick={handleSubmit}>Enviar</button>
                
            </div>
            <div className="message-container">
                <label htmlFor="">Aguardando pagamento</label>
                <p><Input placeholder="Nome Apresentante"
                value={userName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setUserName(event.target.value);
                  }}  
                />, Prenotação nº <Input placeholder="Numero Prenotação"
                type="number"
                value={prenotation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPrenotation(event.target.value);
                  }}
                />.
Estamos esperando o pagamento do boleto/pix enviado para concluir o registro do seu título.
Desconsidere essa mensagem caso já tenha feito o pagamento. 2º Oficial de Registro de Imóveis de Ribeirão Preto.</p>
<button name="default" onClick={handleSubmit}>Enviar</button>
            </div> */}
            </div>
            
        </div>
  )
}

export default StartConversation
