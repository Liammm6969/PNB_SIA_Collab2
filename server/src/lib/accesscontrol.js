const AccessControl = require('accesscontrol');

const grantList = {
  Admin: {
    user: {
      'create:any': ['*'],
      'update:any': ['*'],
      'read:any': ['*'],
    },
    transaction: {
      'read:any': ['*'],
      'create:any': ['*'],
    },
    payment: {
      'read:any': ['*'],
    }
  },

  Finance: {
    user: {
      'read:any': ['role'],
    },
    transaction: {
      'read:any': ['*'],
      'create:any': ['*'],
    },
    payment: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
    }
  },

  BusinessOwner: {
    user: {
      'read:own': ['*'],
    },
    transaction: {
      'read:own': ['*'],
      'create:own': ['*'],
    },
    payment: {
      'create:own': ['*'],
      'read:own': ['*'],
    }
  },

  User: {
    user: {
      'read:own': ['*'],
    },
    transaction: {
      'read:own': ['*'],
      'create:own': ['*'],
    },
    payment: {
      'create:own': ['*'],
      'read:own': ['*'],
    }
  }
};
const ac = new AccessControl(grantList);

module.exports = {
  ac,
  roles: {
    Admin: 'Admin',
    Finance: 'Finance',
    BusinessOwner: 'BusinessOwner',
    User: 'User'
  }
};