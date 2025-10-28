export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string;
};



const users: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
  },
];


  /* FIX ME (types) 😭 */
  export const userModel = {
    findOne: (email: string): User | null => {
      const u = users.find((x) => x.email === email);
      return u || null;
    },
    findById: (id: number): User | null => {
      const u = users.find((x) => x.id === id);
      return u || null;
    },
    
    create: (payload: Partial<User>): User => {
      const id = users.length + 1;
      const newUser: User = {
        id,
        name: payload.name || `user${id}`,
        email: payload.email || `user${id}@example.com`,
        password: payload.password || "changeme",
        role: payload.role || "user",
      };
      users.push(newUser);
      return newUser;
    },
  };
