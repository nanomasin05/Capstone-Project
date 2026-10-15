import { ReactNode } from 'react';
import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Nav from './Nav';
export default async function Shell({children}:{children:ReactNode}){
  try{const u=await requireUser();return <div className="app-layout"><Nav role={u.role} username={u.username}/><div className="main-area"><header className="top-header"><button className="menu-button mobile-only" aria-label="Menu">☰</button><div></div><div className="header-right"><span className="notification">♧</span><div className="profile"><span className="avatar">{u.username?.charAt(0).toUpperCase()||'A'}</span><span>{u.username}</span><span>⌄</span></div></div></header><main className="content-area">{children}</main></div></div>}
  catch{redirect('/login')}
}
