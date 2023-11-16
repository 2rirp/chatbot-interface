/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./quickreplySidebar.css";
import CustomIconButton from "../customIconButton/CustomIconButton";
import ClearIcon from "@mui/icons-material/Clear";

interface QuickreplySidebarProps {
  onClose: () => void;
  onQuickreplyClick: (value: string) => void;
  attendantName?: string;
}

interface IQuickReply {
  title: string;
  message: string;
}

function QuickreplySidebar(props: QuickreplySidebarProps) {
  const quickReply: Array<IQuickReply> = [
    {
      title: "Apresentação",
      message: `Prezado(a), boa tarde.\n\nSou ${props.attendantName} e vou dar continuidade no seu atendimento.\n\nComo posso te ajudar?`,
    },
    {
      title: "Instruções PIX",
      message:
        "No aplicativo do banco, tem que selecionar a forma de pagamento por *Pix*;\n\nApós, selecionar a chave de pagamento como *Pix copia e cola*.\nDepois, tem que copiar todas as letras e números informados acima; do número 0 no início, ao dígito X no final.\n\nSe pressionar o dedo em cima desta conversa, aparecerá a opção de copiar a mensagem toda; depois, basta colar no campo do aplicativo do banco.\n\nNormalmente esse erro ocorre quando é copiado apenas o link em azul, e não todas as informações conforme orientado acima. Poderia verificar por gentileza?",
    },
    {
      title: "Confirmação localização matrícula",
      message:
        "Conforme solicitado via WhatsApp, segue dados para confirmação:\n*Matrícula: XXXXXXXXXXXXXXX// Endereço:  XXXXXXXXXXXXXXXXXXX* \nConfirma os dados acima (  ) SIM ou (   ) NÃO \n*Valor: R$ 68,24*",
    },
    {
      title: "Confirmação pedido / Abertura NFe",
      message:
        "*Digite os dados abaixo para a abertura do protocolo e envio da nota fiscal:*\n\nNome completo:\n\nCPF:\n\nEndereço:\n\nCEP, Rua/ Avenida; nº, complemento; bairro, cidade\n\nTelefone:\n\nE-mail:\n\n*Caso a nota fiscal seja emitida em nome de Pessoa Jurídica, precisamos, também, do nome completo do responsável pelo pedido.*",
    },
    {
      title: "Abertura protocolo",
      message:
        "Seu protocolo foi aberto sob nº *Protocolo*. \nSegue abaixo a *chave PIX copia e cola* no valor de *R$ 68,24*. \nPara efetuar o pagamento: copie esse código, acesse o aplicativo do seu banco e utilize a opção de pagamento via PIX. \nAssim que o pagamento for confirmado, o seu pedido será processado automaticamente e você receberá o link para acessar a certidão solicitada.",
    },
    {
      title: "Documentos para prenotar",
      message:
        "Para recebermos o seu documento e abrirmos o protocolo, se faz necessário o pagamento do valor de R$ 71,44.\n\nPIX:\n\nCNPJ: 51.800.852/0001-02.\n\nFavorecido: 2º Registro de Imóveis de Ribeirão Preto\n\n*Favor encaminhar o comprovante do PIX.*\n\nNão havendo exigências a serem cumpridas, será encaminhado um boleto via e-mail e/ou whatsapp para realização do pagamento complementar devido. Entretanto, havendo necessidade de corrigir ou acrescentar novos documentos no protocolo, encaminharemos uma nota devolutiva com a discriminação das correções necessárias.\n\nDESEJA EMITIR UMA CERTIDÃO DE MATRÍCULA ATUALIZADA APÓS O REGISTRO DO DOCUMENTO:\n\n(  ) SIM ou (   ) NÃO",
    },
    {
      title: "Pedido busca/informação verbal",
      message:
        "Nos informe os dados abaixo:\n\n*1-* Dados do Pesquisado (a pessoa ou imóvel cujos dados serão utilizado para pesquisa);\n\n*2-* Envie uma documentação com foto para identificação do solicitante (os seus dados);\n\n*3-* Finalidade/motivo da pesquisa;\n\n*4-* Entraremos em contato com as informações solicitadas em até x dia(s) útil após a abertura do protocolo.\n\n\n*Valor: R$ 6,79.*",
    },
    {
      title: " Envio link certidão",
      message:
        "Segue o link referente ao seu pedido nº *PROTOCOLO*:\n\nAdemais, informamos que o link para visualização/download ficará disponível por 120 dias, e o arquivo assinado digitalmente é válido e poderá ser compartilhado quando necessário.\n\n*LINK CERTIDAO*\n\nPoderia por favor, confirmar o recebimento do link da certidão?",
    },
    {
      title: "Imóvel do 1o Registro",
      message:
        "O referido imóvel *pertence ao 1º Registro de Imóveis* Local.\n\nPedimos gentilmente que entre em contato pelo telefone *(16) 2132-3970*.",
    },
    {
      title: "Matrículas com mandados de cancelamento / indisponibilidade",
      message:
        "Cumpre-nos informar que na matrícula ora requerida possui um(a) penhora/indisponibilidade, relativo ao processo nº _________, em trâmite perante o Juízo ___________________ em aberto, cujo o mandado/comunicado para cancelamento encontra-se arquivado nesta Serventia.\nCaso tenha o interesse em realizar o cancelamento do gravame em questão, disponibilizaremos o modelo do requerimento necessário para ingresso da prenotação e o valor devido para pratica do ato com emissão da certidão de matrícula é de R$ ___________________.",
    },
    {
      title: "Encerramento por falta de interação.",
      message:
        "Encerraremos esse atendimento por falta de interação. Se precisar de algo, basta iniciar a conversa novamente.\n\nO 2º Registro de Imóveis de Ribeirão Preto agradece seu contato.",
    },
  ];

  const closeSearchSidebar = () => {
    props.onClose();
  };

  /* const handleQuickreplyClick = (message: string) => {
    props.onQuickreplyClick(message);
    // props.onQuickreplyClick(messageId);
  }; */

  return (
    <div className="search-sidebar-container">
      <div className="pattern-header search-sidebar-header">
        <CustomIconButton onClick={closeSearchSidebar}>
          <ClearIcon />
        </CustomIconButton>
        <p>Mensagens Rápidas</p>
      </div>

      <div className="quickreply-sidebar-content">
        {quickReply.map((reply, index) => (
          <div key={index}>
            <button
              onClick={() => props.onQuickreplyClick(reply.message)}
              className="quickreply-button"
            >
              {reply.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickreplySidebar;
