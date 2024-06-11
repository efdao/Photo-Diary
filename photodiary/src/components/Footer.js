import styles from './css/Footer.module.css';
import footer from '../assets/footer.png';


export default function Footer(){
  return(
      <div className={styles.Footer}>
        <p>© 2024 김동현&황지현 All rights reserved</p>
        <a href="https://github.com/efdao/Photo-Diary" target="_blank" rel="noopener noreferrer">
          <img src={footer} alt="footer"/>
        </a>
      </div>
  )
}
