import React from "react";
import HeaderAbout from "../HeaderAbout/HeaderAbout";
import "./AboutMe.css";
import photo from "../../images/photo.png";

function AboutMe() {
  return (
    <div className="about-me">
      <HeaderAbout text="Студент" />
      <div className="about-me__content">
        <div className="about-me__texts">
          <h2 className="about-me__header">Виктор</h2>
          <h3 className="about-me__subtext">Фронтенд-разработчик, 28 лет</h3>
          <p className="about-me__biograf">
            Родился в Перми, живу в Геленджике. Закончил ПНИПУ по специальности 
            прикладная информатика в экономике. У меня есть жена. Планирую сделать
             кодинг своей специальностью, иду к этой цели. 
          </p>
          <a
            href="http://github.com/MarkovViktor"
            className="about-me__link"
            target="_blank"
            rel="noreferrer noopener"
          >
            Github
          </a>
        </div>
        <img className="about-me__img" src={photo} alt="Фото" />
      </div>
    </div>
  );
}

export default AboutMe;
