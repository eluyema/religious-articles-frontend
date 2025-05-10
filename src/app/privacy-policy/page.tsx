import fs from 'fs';
import path from 'path';

const PrivacyPolicy = () => {
    const filePath = path.join(process.cwd(), 'src', 'app', 'privacy-policy', 'policy.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default PrivacyPolicy;
