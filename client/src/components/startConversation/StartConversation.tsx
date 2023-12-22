import "./startConversation.css"
import { Input } from "@mui/material";
import { useState } from "react"


interface IData {
    templateName: string;
    userId: string;
    content: string;
    variables: {name: string, prenotation: string} | undefined;
}

interface newConversationProps {
    attendantName: string;
    attendantRole: string;
    onClick: (data: IData) => void;
}
function StartConversation(props: newConversationProps) {
     const [userName, setUserName] = useState("");
     const [prenotation, setPrenotation] = useState("");
     const [documents, setDocuments] = useState("");
    // const [data, setData] = useState({ 
    //         templateName: '',
    //         userId: '',
    //         content: '',
    //     }
        const [data, setData] = useState<IData>({
            templateName: '',
            userId: '',
            content: '',
            variables: {name: "", prenotation: ""},
        })
    ;
    
const handleSubmit = (event: any) => {
    if(data.userId.trim() !== '' ) {
        switch(event.target.name) {
            case 'default':
                data.templateName = 'default';
                data.content = `Olá! Sou ${props.attendantName} do Segundo Registro de Imóveis. Sinta-se à vontade para esclarecer as suas dúvidas comigo relacionadas às exigências da prenotação nº ${prenotation}.`;
                data.variables = {name: props.attendantName, prenotation: prenotation}
                break;
            case 'waiting_for_documents':
                data.templateName = 'waiting_for_documents'
                data.content = `${userName}, sou ${props.attendantName}, atendente do 2º Registro de Imóveis.\nPrenotação nº ${prenotation}.\nPara continuar a análise do seu título, preciso que me envie ${documents}.\nPara adiantar, envie a informação ou foto de boa qualidade do documento para eu verificar se será suficiente.`;
                data.variables = undefined
                break;
            case 'waiting_payment_1':
                data.templateName = 'waiting_payment_1'
                data.content = `${userName},\n\nPrenotação nº ${prenotation}.\n\nEstamos esperando o pagamento do boleto/pix enviado para concluir o registro do seu título. Desconsidere essa mensagem caso já tenha feito o pagamento. 2º Oficial de Registro de Imóveis de Ribeirão Preto.`;
                data.variables = undefined
                break;
        }
        console.log(data)
        props.onClick(data);
    } else {
        alert("Preencha o campo de Whatsapp")
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
                    <p>Olá! Sou {props.attendantName} do Segundo Registro de Imóveis. Sinta-se à vontade para esclarecer as suas dúvidas comigo relacionadas às exigências da prenotação nº
                    <Input placeholder="Numero Prenotação"
                    type="number"
                    value={prenotation}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPrenotation(event.target.value);
                  }}/>.</p>
                    <button name="default" onClick={handleSubmit}>Enviar</button>
                </div>
             <div className="default-container">
            
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
<button name="waiting_for_documents" onClick={handleSubmit}>Enviar</button>
                
            </div>
            <div className="default-container">
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
<button name="waiting_payment_1" onClick={handleSubmit}>Enviar</button>
            </div>
            </div>
            
        </div>
  )
}

export default StartConversation
