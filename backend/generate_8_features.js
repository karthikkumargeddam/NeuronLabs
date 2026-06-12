const fs = require('fs');
const path = require('path');

const apis = [
  {
    name: 'mentor',
    schema: {
      kind: 'collectionType',
      collectionName: 'mentors',
      info: { singularName: 'mentor', pluralName: 'mentors', displayName: 'Mentor' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        bio: { type: 'text' },
        rate: { type: 'decimal' },
        available_hours: { type: 'string' },
        expertise: { type: 'string' }
      }
    }
  },
  {
    name: 'session',
    schema: {
      kind: 'collectionType',
      collectionName: 'sessions',
      info: { singularName: 'session', pluralName: 'sessions', displayName: 'Session' },
      options: { draftAndPublish: true },
      attributes: {
        user: { type: 'string' }, // should be relation in a real app
        mentor: { type: 'relation', relation: 'manyToOne', target: 'api::mentor.mentor', inversedBy: 'sessions' },
        date: { type: 'datetime' },
        status: { type: 'enumeration', enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
      }
    }
  },
  {
    name: 'team',
    schema: {
      kind: 'collectionType',
      collectionName: 'teams',
      info: { singularName: 'team', pluralName: 'teams', displayName: 'Team' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        description: { type: 'text' },
        leader: { type: 'string' },
        members: { type: 'json' }
      }
    }
  },
  {
    name: 'organization',
    schema: {
      kind: 'collectionType',
      collectionName: 'organizations',
      info: { singularName: 'organization', pluralName: 'organizations', displayName: 'Organization' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        description: { type: 'text' },
        logoUrl: { type: 'string' },
        verified: { type: 'boolean', default: false }
      }
    }
  },
  {
    name: 'bounty',
    schema: {
      kind: 'collectionType',
      collectionName: 'bounties',
      info: { singularName: 'bounty', pluralName: 'bounties', displayName: 'Bounty' },
      options: { draftAndPublish: true },
      attributes: {
        title: { type: 'string' },
        description: { type: 'richtext' },
        reward_amount: { type: 'decimal' },
        status: { type: 'enumeration', enum: ['open', 'in_progress', 'completed'], default: 'open' }
      }
    }
  },
  {
    name: 'submission',
    schema: {
      kind: 'collectionType',
      collectionName: 'submissions',
      info: { singularName: 'submission', pluralName: 'submissions', displayName: 'Submission' },
      options: { draftAndPublish: true },
      attributes: {
        bounty: { type: 'relation', relation: 'manyToOne', target: 'api::bounty.bounty', inversedBy: 'submissions' },
        user: { type: 'string' },
        content: { type: 'text' },
        link: { type: 'string' },
        status: { type: 'enumeration', enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
      }
    }
  },
  {
    name: 'hackathon',
    schema: {
      kind: 'collectionType',
      collectionName: 'hackathons',
      info: { singularName: 'hackathon', pluralName: 'hackathons', displayName: 'Hackathon' },
      options: { draftAndPublish: true },
      attributes: {
        title: { type: 'string' },
        description: { type: 'richtext' },
        start_date: { type: 'datetime' },
        end_date: { type: 'datetime' },
        prizes: { type: 'json' }
      }
    }
  },
  {
    name: 'badge',
    schema: {
      kind: 'collectionType',
      collectionName: 'badges',
      info: { singularName: 'badge', pluralName: 'badges', displayName: 'Badge' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        description: { type: 'text' },
        icon_url: { type: 'string' },
        criteria: { type: 'string' }
      }
    }
  },
  {
    name: 'user-achievement',
    schema: {
      kind: 'collectionType',
      collectionName: 'user_achievements',
      info: { singularName: 'user-achievement', pluralName: 'user-achievements', displayName: 'User Achievement' },
      options: { draftAndPublish: true },
      attributes: {
        user: { type: 'string' },
        badge: { type: 'relation', relation: 'manyToOne', target: 'api::badge.badge' },
        date_earned: { type: 'datetime' }
      }
    }
  },
  {
    name: 'article',
    schema: {
      kind: 'collectionType',
      collectionName: 'articles',
      info: { singularName: 'article', pluralName: 'articles', displayName: 'Article' },
      options: { draftAndPublish: true },
      attributes: {
        title: { type: 'string' },
        content: { type: 'richtext' },
        author: { type: 'string' },
        published_at: { type: 'datetime' },
        cover_image: { type: 'string' }
      }
    }
  },
  {
    name: 'compute-instance',
    schema: {
      kind: 'collectionType',
      collectionName: 'compute_instances',
      info: { singularName: 'compute-instance', pluralName: 'compute-instances', displayName: 'Compute Instance' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        gpu_type: { type: 'string' },
        hourly_rate: { type: 'decimal' },
        status: { type: 'enumeration', enum: ['available', 'rented', 'offline'], default: 'available' }
      }
    }
  },
  {
    name: 'referral',
    schema: {
      kind: 'collectionType',
      collectionName: 'referrals',
      info: { singularName: 'referral', pluralName: 'referrals', displayName: 'Referral' },
      options: { draftAndPublish: true },
      attributes: {
        referrer_id: { type: 'string' },
        referred_email: { type: 'email' },
        status: { type: 'enumeration', enum: ['pending', 'signed_up', 'rewarded'], default: 'pending' },
        reward_credits: { type: 'integer' }
      }
    }
  }
];

const apiDir = path.join(__dirname, 'src', 'api');

apis.forEach(api => {
  const dir = path.join(apiDir, api.name);
  const contentTypesDir = path.join(dir, 'content-types', api.name);
  const controllersDir = path.join(dir, 'controllers');
  const routesDir = path.join(dir, 'routes');
  const servicesDir = path.join(dir, 'services');

  [contentTypesDir, controllersDir, routesDir, servicesDir].forEach(d => {
    fs.mkdirSync(d, { recursive: true });
  });

  // schema.json
  fs.writeFileSync(
    path.join(contentTypesDir, 'schema.json'),
    JSON.stringify(api.schema, null, 2)
  );

  // controller
  fs.writeFileSync(
    path.join(controllersDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreController } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreController('api::${api.name}.${api.name}');\n`
  );

  // route
  fs.writeFileSync(
    path.join(routesDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreRouter } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreRouter('api::${api.name}.${api.name}');\n`
  );

  // service
  fs.writeFileSync(
    path.join(servicesDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreService } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreService('api::${api.name}.${api.name}');\n`
  );
  
  console.log(`Created API: ${api.name}`);
});

console.log('All APIs created. Please restart Strapi.');
