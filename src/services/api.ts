export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Application {
    id: string;
    email: string;
    password?: string; // In real app, don't return this!
    name: string;
    studentId: string;
    department: string;
    phone: string;
    baekjoonId: string;
    language: string;
    motivation: string;
    status: ApplicationStatus;
    createdAt: string;
}

// Mock Data
const MOCK_USERS: User[] = [
    { id: '1', email: 'admin@solutio.com', name: '관리자', role: 'ADMIN' },
    { id: '2', email: 'member@solutio.com', name: '일반부원', role: 'MEMBER' },
];

let MOCK_APPLICATIONS: Application[] = [
    {
        id: '1',
        email: 'student1@kyonggi.ac.kr',
        name: '김알고',
        studentId: '202300001',
        department: '컴퓨터공학전공',
        phone: '010-1111-2222',
        baekjoonId: 'algo_kim',
        language: 'C++',
        motivation: '알고리즘을 배우고 싶습니다. 백준 플래티넘이 목표입니다.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '2',
        email: 'student2@kyonggi.ac.kr',
        name: '이코딩',
        studentId: '202300002',
        department: 'AI컴퓨터공학부',
        phone: '010-3333-4444',
        baekjoonId: 'code_lee',
        language: 'Python',
        motivation: '인공지능과 알고리즘을 접목하고 싶어요.',
        status: 'ACCEPTED',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: '3',
        email: 'student3@kyonggi.ac.kr',
        name: '박자바',
        studentId: '202300003',
        department: '소프트웨어경영대학',
        phone: '010-5555-6666',
        baekjoonId: 'java_park',
        language: 'Java',
        motivation: '',
        status: 'REJECTED',
        createdAt: new Date(Date.now() - 250000000).toISOString(),
    }
];

export const api = {
    login: async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@solutio.com' && password === 'admin123') {
                    resolve(MOCK_USERS[0]);
                } else if (email === 'member@solutio.com' && password === 'user123') {
                    resolve(MOCK_USERS[1]);
                } else {
                    reject('이메일 또는 비밀번호가 올바르지 않습니다.');
                }
            }, 500);
        });
    },

    submitApplication: async (data: Omit<Application, 'id' | 'status' | 'createdAt'>) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newApp: Application = {
                    ...data,
                    id: String(MOCK_APPLICATIONS.length + 1),
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                };
                MOCK_APPLICATIONS = [newApp, ...MOCK_APPLICATIONS];
                resolve(newApp);
            }, 500);
        });
    },

    getApplications: async (): Promise<Application[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...MOCK_APPLICATIONS]);
            }, 300);
        });
    },

    updateApplicationStatus: async (id: string, status: ApplicationStatus) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const app = MOCK_APPLICATIONS.find(a => a.id === id);
                if (app) {
                    app.status = status;
                    resolve(app);
                } else {
                    reject('신청서를 찾을 수 없습니다.');
                }
            }, 300);
        });
    },

    // Bulk action mock
    processApplications: async (ids: string[], action: 'APPROVE_AND_NOTIFY') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // In real app, this would send emails/create accounts
                console.log(`Processing ${ids.length} applications with action ${action}`);
                ids.forEach(id => {
                    const app = MOCK_APPLICATIONS.find(a => a.id === id);
                    if (app && action === 'APPROVE_AND_NOTIFY') {
                        app.status = 'ACCEPTED';
                    }
                });
                resolve(true);
            }, 1000);
        })
    }
};
