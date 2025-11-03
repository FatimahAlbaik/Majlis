import React from 'react';
import { useApp } from '../hooks/useApp.ts';
import { Role } from '../types.ts';
import { UserIcon, DownloadIcon } from './Icons.tsx';

export const Students: React.FC = () => {
    const { users, translations: t } = useApp();

    const students = users.filter(user => user.role === Role.Student);

    return (
        <div className="max-w-6xl mx-auto">
             <h1 className="text-3xl font-bold text-slate-800 mb-6">{t.studentList}</h1>

             <div className="bg-white rounded-xl shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.fullName}</th>
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.bio}</th>
                                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t.cv}</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-slate-200">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {student.avatarUrl ? (
                                                <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-slate-500" />
                                                </div>
                                            )}
                                            <div className="ms-4">
                                                <div className="text-sm font-medium text-slate-900">{student.name}</div>
                                                <div className="text-sm text-slate-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-800 max-w-sm truncate">{student.bio}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {student.cvUrl ? (
                                            <a href={student.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark transition-all duration-200 transform hover:-translate-y-0.5">
                                                <DownloadIcon className="me-2 h-4 w-4" />
                                                {t.downloadCV}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500 italic text-xs">{t.noCV}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};