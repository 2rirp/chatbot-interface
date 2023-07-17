import "./form.css";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="formContainer">
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          className="patternInput"
          onChange={props.handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          required
          className="patternInput"
          onChange={props.handlePasswordChange}
        />
        <button type="submit" className="patternButton">
          Login
        </button>
      </div>
    </form>
  );
}
