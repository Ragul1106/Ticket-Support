const users = [
  { email: 'admin@ticket.com', password: 'admin123', role: 'admin' },
  { email: 'agent@ticket.com', password: 'agent123', role: 'agent' }
];

export default {
  login: async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    const user = users.find(u => 
      u.email === email && u.password === password
    );

    if (!user) throw new Error('Invalid credentials');
    
    return { 
      token: 'mock-token', 
      user: { email: user.email, role: user.role } 
    };
  }
};