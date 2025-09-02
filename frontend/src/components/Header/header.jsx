import "../styles/Header.css";
import plano_fundo from "../Header/img/header.svg"
import "../styles/reset.css"
import yasmnin from "../Header/img/Yasmin.svg"
import psi_plano from "../Header/img/psi_plano.svg"
import"../styles/reset.css"
import yasmin_nome from "../Header/img/yasmin_nome_completo.svg"


function Header() {
  return (
    <header className="header">

      <img src={yasmin_nome} alt="" className="yasmin_completo"/>
      <img src= {yasmnin} alt="yasmin" className="yasmin__img" />
      <img src={psi_plano} alt="psi plano" className="psi__plano" />
    </header>
  );
}

export default Header;