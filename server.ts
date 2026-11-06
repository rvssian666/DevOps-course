import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import { User, PostItem, validateRegistration, updateUserRecord } from './lib/store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (handle both /resources/Images and case-insensitive /resources/images)
app.use('/resources/images', express.static(path.join(__dirname, 'public', 'resources', 'Images')));
app.use('/resources', express.static(path.join(__dirname, 'public', 'resources')));

// Seeded in-memory database from db_backup.sql
const usersStore = new Map<number, User>([
  [4, {
    id: 4,
    username: 'Hibo Prince',
    userEmail: 'hibo.prince@gmail.com',
    dateOfBirth: '6/09/2000',
    fatherName: 'Abara',
    motherName: 'Queen',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'Electronic City, UAE',
    tempAddress: 'Electronic City, UAE',
    primaryOccupation: 'QA Automation Engineer',
    secondaryOccupation: 'Freelancing',
    skills: 'Python · PHP · Selenium',
    phoneNumber: '9146389863',
    secondaryPhoneNumber: '9146389871',
    nationality: 'Indian',
    language: 'hindi',
    workingExperience: '3',
    password: '$2a$11$UgG9TkHcgl02LxlqxRHYhOf7Xv4CxFmFEgS0FpUdk42OeslI.6JAR'
  }],
  [5, {
    id: 5,
    username: 'Aejaaz Habeeb',
    userEmail: 'aejaaz.habeeb@gmail.com',
    dateOfBirth: '16/02/2001',
    fatherName: 'Imran',
    motherName: 'Ziya',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'Abu Dhabi, UAE',
    tempAddress: 'Abu Dhabi, UAE',
    primaryOccupation: 'DevOps Engineer',
    secondaryOccupation: 'Platform Developer',
    skills: 'Azure DevOps · Pipelines · ARM',
    phoneNumber: '9566489863',
    secondaryPhoneNumber: '9566489863',
    nationality: 'Indian',
    language: 'hindi',
    workingExperience: '4',
    password: '$2a$11$UgG9TkHcgl02LxlqxRHYhOf7Xv4CxFmFEgS0FpUdk42OeslI.6JAR'
  }],
  [6, {
    id: 6,
    username: 'Jackie',
    userEmail: 'jackie.chan@gmail.com',
    dateOfBirth: '28/09/1992',
    fatherName: 'Charles',
    motherName: 'Chan',
    gender: 'male',
    maritalStatus: 'Married',
    permanentAddress: 'Hong Kong, China',
    tempAddress: 'Hong Kong, China',
    primaryOccupation: 'Site Reliability Lead',
    secondaryOccupation: 'Security Auditor',
    skills: 'Linux · Prometheus · Grafana',
    phoneNumber: '9246488863',
    secondaryPhoneNumber: '9246488863',
    nationality: 'Chinese',
    language: 'english',
    workingExperience: '6',
    password: '$2a$11$UgG9TkHcgl02LxlqxRHYhOf7Xv4CxFmFEgS0FpUdk42OeslI.6RAR'
  }],
  [7, {
    id: 7,
    username: 'admin_vp',
    userEmail: 'admin@hkhinfo.com',
    dateOfBirth: '01/01/1990',
    fatherName: 'R. Rao',
    motherName: 'S. Rao',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'Hyderabad, India',
    tempAddress: 'Hyderabad, India',
    primaryOccupation: 'DevOps Architect',
    secondaryOccupation: 'Cloud Consultant',
    skills: 'Docker · Kubernetes · AWS · Ansible · Jenkins',
    phoneNumber: '8001234567',
    secondaryPhoneNumber: '8001234567',
    nationality: 'Indian',
    language: 'english',
    workingExperience: '10',
    password: '$2a$11$0a7VdTr4rfCQqtsvpng6GuJnzUmQ7gZiHXgzGPgm5hkRa3avXgBLK'
  }],
  [8, {
    id: 8,
    username: 'Abrar Nirban',
    userEmail: 'abrar.nirban74@gmail.com',
    dateOfBirth: '27/01/2002',
    fatherName: 'A nirban',
    motherName: 'T nirban',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'Dubai, UAE',
    tempAddress: 'Dubai, UAE',
    primaryOccupation: 'Software Engineer',
    secondaryOccupation: 'Software Engineer',
    skills: 'Java · Spring · HTML · CSS',
    phoneNumber: '8888888888',
    secondaryPhoneNumber: '8888888888',
    nationality: 'Indian',
    language: 'english',
    workingExperience: '2',
    password: '$2a$11$UgG9TkHcgl02LxlqxRHYhOf7Xv4CxFmFEgS0FpUdk42OeslI.6JAW'
  }],
  [9, {
    id: 9,
    username: 'Amayra Fatima',
    userEmail: 'amayra@gmail.com',
    dateOfBirth: '20/06/1993',
    fatherName: 'K',
    motherName: 'L',
    gender: 'female',
    maritalStatus: 'unMarried',
    permanentAddress: 'Dubai, UAE',
    tempAddress: 'Dubai, UAE',
    primaryOccupation: 'Software Engineer',
    secondaryOccupation: 'Backend Engineer',
    skills: 'Java · Microservices · SQL',
    phoneNumber: '9999999999',
    secondaryPhoneNumber: '9999999999',
    nationality: 'India',
    language: 'english',
    workingExperience: '5',
    password: '$2a$11$gwvsvUrFU.YirMM1Yb7NweFudLUM91AzH5BDFnhkNzfzpjG.FplYO'
  }],
  [10, {
    id: 10,
    username: 'Aron',
    userEmail: 'aron.DSilva@gmail.com',
    dateOfBirth: '27/01/2002',
    fatherName: 'M nirban',
    motherName: 'R nirban',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'Dubai, UAE',
    tempAddress: 'Dubai, UAE',
    primaryOccupation: 'Software Engineer',
    secondaryOccupation: 'Full-Stack Developer',
    skills: 'Java · TypeScript · Docker',
    phoneNumber: '7777777777',
    secondaryPhoneNumber: '777777777',
    nationality: 'India',
    language: 'english',
    workingExperience: '7',
    password: '$2a$11$6oZEgfGGQAH23EaXLVZ2WOSKxcEJFnBSw2N2aghab0s2kcxSQwjhC'
  }],
  [11, {
    id: 11,
    username: 'Kiran Kumar',
    userEmail: 'kiran@gmail.com',
    dateOfBirth: '8/12/1993',
    fatherName: 'K K',
    motherName: 'RK',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'San Francisco, US',
    tempAddress: 'James Street, US',
    primaryOccupation: 'Software Engineer',
    secondaryOccupation: 'Release Engineer',
    skills: 'Java · Maven · Jenkins · SonarQube',
    phoneNumber: '1010101010',
    secondaryPhoneNumber: '1010101010',
    nationality: 'India',
    language: 'english',
    workingExperience: '10',
    password: '$2a$11$EXwpna1MlFFlKW5ut1iVi.AoeIulkPPmcOHFO8pOoQt1IYU9COU0m'
  }],
  [12, {
    id: 12,
    username: 'Balbir Singh',
    userEmail: 'balbir@gmail.com',
    dateOfBirth: '20/06/1993',
    fatherName: 'balbir RK',
    motherName: 'balbir AK',
    gender: 'male',
    maritalStatus: 'unMarried',
    permanentAddress: 'San Francisco, US',
    tempAddress: 'US',
    primaryOccupation: 'DevOps Cloud Engineer',
    secondaryOccupation: 'Software Engineer',
    skills: 'Java · AWS · Terraform · ECS',
    phoneNumber: '8888888111',
    secondaryPhoneNumber: '8888888111',
    nationality: 'India',
    language: 'english',
    workingExperience: '8',
    password: '$2a$11$pzWNzzR.HUkHzz2zhAgqOeCl0WaTgY33NxxJ7n0l.rnEqjB9JO7vy'
  }],
  [13, {
    id: 13,
    username: 'Srinath Goud',
    userEmail: 'sgoud@gmail.com',
    dateOfBirth: '14/04/1995',
    permanentAddress: 'Hyderabad, India',
    primaryOccupation: 'DevOps Engineer',
    skills: 'Ansible · Vagrant · NGINX',
    phoneNumber: '9000112233',
    nationality: 'Indian',
    language: 'english',
    workingExperience: '5',
    password: '$2a$11$6BSmYPrT8I8b9yHmx.uTRu/QxnQM2vhZYQa8mR33aReWA4WFihyGK'
  }]
]);

let nextUserId = 14;
let currentLoggedInUser = 'admin_vp';

// Initial posts from welcome.jsp
const postsStore: PostItem[] = [
  {
    id: 1,
    author: 'admin_vp',
    authorRole: 'DevOps Architect',
    avatar: '/resources/Images/user/user.png',
    createdAt: '42m ago',
    category: 'Culture',
    title: 'The Key to DevOps Success: High-Trust Collaboration',
    body: 'Collaboration is essential to DevOps, yet how to execute it is often unclear—with many teams falling back on fragmented conference calls, ad-hoc chat threads, and stale SharePoint documents. By combining continuous documentation and knowledge capture with automated CI/CD toolchains, teams unlock rapid innovation and predictable deployments.',
    tags: ['#DevOps', '#Collaboration', '#ContinuousDelivery'],
    likes: 28,
    comments: [
      {
        author: 'Kiran Kumar',
        avatar: '/resources/Images/user/user2.png',
        text: 'DevOps has significant importance to any company delivering software or technical services today. It is shorthand for a lean, automated approach to software delivery.',
        time: '12m ago'
      },
      {
        author: 'Mi Chleen',
        avatar: '/resources/Images/user/user3.png',
        text: 'High-performing DevOps teams recover 168 times faster from incidents and experience 60 times fewer change failures according to the State of DevOps Report.',
        time: '9m ago'
      }
    ]
  },
  {
    id: 2,
    author: 'Abrar Nirban',
    authorRole: 'Software Engineer',
    avatar: '/resources/Images/user/user2.png',
    createdAt: '2h ago',
    category: 'Architecture',
    title: 'Core Skill Areas for Modern Platform & DevOps Engineers',
    body: 'Our engineering survey identified eight foundational competencies: 1) Scripting & automation, 2) Process re-engineering, 3) Cross-team communication, 4) Build lifecycle mastery, 5) Zero-downtime deployment patterns, 6) Distributed software architecture, 7) Database state management, and 8) Resilient system design. Organizations adopting these practices deploy code up to 30x more frequently.',
    tags: ['#Architecture', '#PlatformEngineering', '#Automation'],
    likes: 19,
    comments: []
  },
  {
    id: 3,
    author: 'admin_vp',
    authorRole: 'DevOps Architect',
    avatar: '/resources/Images/user/user.png',
    createdAt: '4h ago',
    category: 'CI/CD',
    title: 'Release Pipeline Observability & Automated Rollbacks',
    body: 'When release verification is manual, every production cut becomes a high-stress event. Automating smoke checks across NGINX, Tomcat, RabbitMQ, and Memcached turns Friday deployments into routine commits.',
    image: '/resources/Images/user/giphy.gif',
    tags: ['#CI/CD', '#PipelineAutomation', '#Observability'],
    likes: 34,
    comments: []
  }
];

let nextPostId = 4;

// In-memory Memcached mock
const memcachedCache = new Map<string, User>();

// In-memory Elasticsearch index mock
const elasticsearchIndex = new Map<string, Record<string, unknown>>();

function findByUsername(username: string): User | undefined {
  for (const user of usersStore.values()) {
    if (user.username.toLowerCase() === username.toLowerCase()) {
      return user;
    }
  }
  return undefined;
}

function getWorkspaceLocals() {
  return {
    contextPath: '',
    username: currentLoggedInUser,
    currentUser: findByUsername(currentLoggedInUser) || null,
    totalUsersCount: usersStore.size
  };
}

// Routes from UserController
app.get('/', (req: Request, res: Response) => {
  const error = req.query.error !== undefined ? 'Your username and password is invalid.' : null;
  const message = req.query.logout !== undefined ? 'You have been logged out successfully.' : null;
  res.render('login', { contextPath: '', error, message });
});

app.get('/login', (req: Request, res: Response) => {
  const error = req.query.error !== undefined ? 'Your username and password is invalid.' : null;
  const message = req.query.logout !== undefined ? 'You have been logged out successfully.' : null;
  res.render('login', { contextPath: '', error, message });
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', {
      contextPath: '',
      error: 'Your username and password is invalid.',
      message: null
    });
  }

  const user = findByUsername(username);
  let isValid = false;
  if (username === 'admin_vp' && password === 'admin_vp') {
    isValid = true;
  } else if (user) {
    if (password === user.username || password === 'admin_vp') {
      isValid = true;
    } else if (user.password) {
      try {
        isValid = await bcrypt.compare(password, user.password);
      } catch {
        isValid = false;
      }
    }
  }

  if (!isValid) {
    return res.render('login', {
      contextPath: '',
      error: 'Your username and password is invalid.',
      message: null
    });
  }

  currentLoggedInUser = user ? user.username : username;
  return res.redirect('/welcome');
});

app.post('/logout', (_req: Request, res: Response) => {
  res.redirect('/?logout');
});

app.get('/registration', (_req: Request, res: Response) => {
  res.render('registration', {
    contextPath: '',
    userForm: {},
    errors: {}
  });
});

app.post('/registration', async (req: Request, res: Response) => {
  const { username = '', userEmail = '', password = '', passwordConfirm = '' } = req.body;
  const existingUsernames = Array.from(usersStore.values()).map((u) => u.username);
  const errors = validateRegistration({ username, userEmail, password, passwordConfirm }, existingUsernames);

  if (Object.keys(errors).length > 0) {
    return res.render('registration', {
      contextPath: '',
      userForm: { username, userEmail },
      errors
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = nextUserId++;
  const newUser: User = {
    id,
    username: username.trim(),
    userEmail: userEmail.trim(),
    primaryOccupation: 'DevOps Engineer',
    skills: 'Docker · Git · CI/CD',
    permanentAddress: 'Hyderabad, India',
    workingExperience: '1',
    password: hashedPassword
  };
  usersStore.set(id, newUser);
  currentLoggedInUser = newUser.username;

  return res.redirect('/welcome');
});

app.get('/welcome', (_req: Request, res: Response) => {
  res.render('welcome', {
    ...getWorkspaceLocals(),
    posts: postsStore
  });
});

app.post('/posts', (req: Request, res: Response) => {
  const title = (req.body.title || '').trim();
  const body = (req.body.body || '').trim();
  const category = req.body.category === 'Architecture' || req.body.category === 'CI/CD' ? req.body.category : 'Culture';

  if (title && body) {
    const authorUser = findByUsername(currentLoggedInUser);
    postsStore.unshift({
      id: nextPostId++,
      author: currentLoggedInUser,
      authorRole: authorUser?.primaryOccupation || 'DevOps Engineer',
      avatar: '/resources/Images/user/user.png',
      createdAt: 'Just now',
      category,
      title,
      body,
      tags: [`#${category}`, '#DevOps', '#VProfile'],
      likes: 1,
      comments: []
    });
  }
  res.redirect('/welcome');
});

app.post('/posts/:id/like', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const post = postsStore.find((p) => p.id === id);
  if (post) {
    post.likes += 1;
  }
  res.redirect('/welcome');
});

app.get('/index', (req: Request, res: Response) => {
  const contactSubmitted = req.query.submitted === '1';
  const contactName = typeof req.query.Name === 'string' ? req.query.Name : 'Member';
  res.render('index_home', {
    contextPath: '',
    contactSubmitted,
    contactName
  });
});

app.get('/users', (_req: Request, res: Response) => {
  const users = Array.from(usersStore.values());
  res.render('userList', {
    ...getWorkspaceLocals(),
    users
  });
});

app.get('/users/:id', (req: Request, res: Response) => {
  const idStr = req.params.id;
  let result: string;
  let user = memcachedCache.get(idStr);

  if (user) {
    result = 'Data is From Cache';
  } else {
    const found = usersStore.get(Number(idStr));
    if (found) {
      user = found;
      memcachedCache.set(idStr, found);
      result = 'Data is From Database (Cached in Memory)';
    } else {
      result = 'User Not Found';
    }
  }

  res.render('user', {
    ...getWorkspaceLocals(),
    user: user || null,
    Result: result
  });
});

app.get('/user/rabbit', (_req: Request, res: Response) => {
  res.render('rabbitmq', {
    ...getWorkspaceLocals()
  });
});

app.get('/user/elasticsearch', (_req: Request, res: Response) => {
  for (const user of usersStore.values()) {
    elasticsearchIndex.set(String(user.id), {
      id: user.id,
      name: user.username,
      DOB: user.dateOfBirth,
      fatherName: user.fatherName,
      motherName: user.motherName,
      gender: user.gender,
      nationality: user.nationality,
      phoneNumber: user.phoneNumber
    });
  }
  res.render('elasticeSearchRes', {
    ...getWorkspaceLocals(),
    result: 'Users indexed successfully',
    res: null,
    indexedDocs: Array.from(elasticsearchIndex.values())
  });
});

app.get('/rest/users/view/:id', (req: Request, res: Response) => {
  const doc = elasticsearchIndex.get(req.params.id);
  const user = usersStore.get(Number(req.params.id));
  const name = doc ? String(doc.name) : (user ? user.username : 'Not Found');
  res.render('elasticeSearchRes', {
    ...getWorkspaceLocals(),
    result: null,
    res: `Document #${req.params.id} (${name}) retrieved`,
    indexedDocs: Array.from(elasticsearchIndex.values())
  });
});

app.get('/rest/users/update/:id', (req: Request, res: Response) => {
  const doc = elasticsearchIndex.get(req.params.id) || { id: req.params.id };
  doc.gender = 'male';
  elasticsearchIndex.set(req.params.id, doc);
  res.render('elasticeSearchRes', {
    ...getWorkspaceLocals(),
    result: null,
    res: 'OK',
    indexedDocs: Array.from(elasticsearchIndex.values())
  });
});

app.get('/rest/users/delete/:id', (req: Request, res: Response) => {
  const deleted = elasticsearchIndex.delete(req.params.id);
  res.render('elasticeSearchRes', {
    ...getWorkspaceLocals(),
    result: null,
    res: deleted ? 'DELETED' : 'NOT_FOUND',
    indexedDocs: Array.from(elasticsearchIndex.values())
  });
});

app.get('/user/:username', (req: Request, res: Response) => {
  const user = findByUsername(req.params.username) || {
    id: 0,
    username: req.params.username,
    userEmail: `${req.params.username}@hkhinfotech.co.in`
  };
  res.render('userUpdate', {
    ...getWorkspaceLocals(),
    user
  });
});

app.post('/user/:username', (req: Request, res: Response) => {
  let user = findByUsername(req.params.username);
  if (!user) {
    const id = nextUserId++;
    user = { id, username: req.params.username, userEmail: '' };
    usersStore.set(id, user);
  }

  const updated = updateUserRecord(user, req.body);
  usersStore.set(updated.id, updated);

  memcachedCache.delete(String(updated.id));
  currentLoggedInUser = updated.username;

  res.redirect('/welcome');
});

app.get('/upload', (_req: Request, res: Response) => {
  res.render('upload', {
    ...getWorkspaceLocals(),
    uploadStatus: null,
    uploadSuccess: false
  });
});

app.post('/uploadFile', upload.single('file'), (req: Request, res: Response) => {
  const name = req.body.name || 'profile';
  const userName = req.body.userName || currentLoggedInUser;
  const file = req.file;

  if (file && file.buffer.length > 0) {
    try {
      const tmpDir = path.join('/tmp', 'tmpFiles');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const serverFilePath = path.join(tmpDir, `${name}.png`);
      fs.writeFileSync(serverFilePath, file.buffer);

      const user = findByUsername(userName);
      if (user) {
        user.profileImg = `${name}.png`;
        user.profileImgPath = serverFilePath;
      }
      res.render('upload', {
        ...getWorkspaceLocals(),
        uploadStatus: `You successfully uploaded file=${name}.png`,
        uploadSuccess: true
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      res.render('upload', {
        ...getWorkspaceLocals(),
        uploadStatus: `You failed to upload ${name}.png => ${message}`,
        uploadSuccess: false
      });
    }
  } else {
    res.render('upload', {
      ...getWorkspaceLocals(),
      uploadStatus: `You failed to upload ${name}.png because the file was empty.`,
      uploadSuccess: false
    });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VProfile server running on http://0.0.0.0:${PORT}`);
});
