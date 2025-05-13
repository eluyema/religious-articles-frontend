import fs from 'fs';
import path from 'path';
import styles from './index.module.scss';


const PrivacyPolicy = () => {
    const filePath = path.join(process.cwd(), 'src', 'app', '[locale]' , 'privacy-policy', 'policy.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    return <main className={styles.container}>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: html}}/>
    </main>;
};

export default PrivacyPolicy;
