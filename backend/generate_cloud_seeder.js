const fs = require('fs');

const seed_expansion = fs.readFileSync('c:\\Neuron\\backend\\seed_expansion.js', 'utf8');
const seed_new_apis = fs.readFileSync('c:\\Neuron\\backend\\seed_new_apis.js', 'utf8');

const extractArray = (fileContent, arrayName) => {
    const regex = new RegExp('const ' + arrayName + ' = (\\\\[[\\\\s\\\\S]*?\\\\]);');
    const match = fileContent.match(regex);
    return match ? match[1] : '[]';
};

const cloudSeederContent = `
module.exports = async (strapi) => {
    console.log('Starting cloud_seeder...');

    const jobs = ${extractArray(seed_expansion, 'jobs')};
    const profiles = ${extractArray(seed_expansion, 'profiles')};
    const models = ${extractArray(seed_expansion, 'models')};
    const datasets = ${extractArray(seed_new_apis, 'datasets')};
    const showcases = ${extractArray(seed_new_apis, 'showcases')};
    const competitions = ${extractArray(seed_new_apis, 'competitions')};

    const seed = async (uid, dataArray, searchKey = 'title') => {
        for (const item of dataArray) {
            try {
                let queryKey = searchKey;
                if (uid === 'api::model.model') queryKey = 'name';
                if (uid === 'api::profile.profile') queryKey = 'username';
                
                const existing = await strapi.documents(uid).findFirst({
                    filters: { [queryKey]: item[queryKey] }
                });
                if (!existing) {
                    await strapi.documents(uid).create({ data: item, status: 'published' });
                    console.log(\`Seeded \${uid}: \${item[queryKey]}\`);
                }
            } catch(e) {
                console.error(\`Error seeding \${uid}:\`, e.message);
            }
        }
    };

    await seed('api::job.job', jobs);
    await seed('api::profile.profile', profiles);
    await seed('api::model.model', models);
    await seed('api::dataset.dataset', datasets);
    await seed('api::showcase.showcase', showcases);
    await seed('api::competition.competition', competitions);

    // Set Public Permissions
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
        const uids = [
            'api::job.job',
            'api::profile.profile',
            'api::model.model',
            'api::dataset.dataset',
            'api::showcase.showcase',
            'api::competition.competition',
            'api::lab.lab'
        ];
        for (const uid of uids) {
            const actions = [\`\${uid}.find\`, \`\${uid}.findOne\`];
            for (const action of actions) {
                const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                    where: { action, role: publicRole.id }
                });
                if (!existing) {
                    await strapi.db.query('plugin::users-permissions.permission').create({
                        data: { action, role: publicRole.id }
                    });
                    console.log(\`Granted \${action} to public role\`);
                }
            }
        }
    }
    console.log('Cloud seeding complete.');
};
`;

fs.writeFileSync('c:\\Neuron\\backend\\src\\cloud_seeder.js', cloudSeederContent);
