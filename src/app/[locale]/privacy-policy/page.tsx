import fs from 'fs';
import path from 'path';
import styles from './index.module.scss';
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";


const PrivacyPolicy = () => {
    const filePath = path.join(process.cwd(), 'src', 'app', '[locale]' , 'privacy-policy', 'policy.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    return <>
        <Header/>
        <main className={styles.container}>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: html}}/>
        </main>
        <Footer/>
    </>;
};

export default PrivacyPolicy;
