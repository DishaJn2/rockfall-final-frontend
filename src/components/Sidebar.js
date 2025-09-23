// src/components/Sidebar.js

import React from "react";



/* Self-contained Sidebar: default export, no external icons, plain <a> links */

const NavItem = ({ href = "#", label, children }) => (

  <a href={href} className="flex items-center space-x-3 p-2 rounded hover:bg-green-100" title={label}>

    <span className="w-5 h-5 flex items-center justify-center">{children}</span>

    <span className="text-sm">{label}</span>

  </a>

);



export default function Sidebar() {

  return (

    <aside className="h-screen w-64 bg-white shadow-md flex flex-col">

      <div className="p-6 font-bold text-green-700 text-xl">RockGuard</div>

      <nav className="flex-1 px-3 space-y-1">

        <NavItem href="/dashboard" label="Overview">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M5 12v7a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-7" strokeLinecap="round" strokeLinejoin="round" />

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="Sensor Network">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M4 11a9 9 0 0 1 9 9" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M4 6a14 14 0 0 1 14 14" strokeLinecap="round" strokeLinejoin="round" />

            <circle cx="6.5" cy="17.5" r="1.5" />

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="3D Mine View">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.4">

            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M3.27 6.96 12 12.01l8.73-5.05" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="AI Predictive">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M9 18v-2a3 3 0 0 1 3-3h0" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M7 9a5 5 0 0 1 10 0" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="Personnel Tracking">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M16 11a4 4 0 1 0-8 0" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="Risk Analysis">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M3 12h3l2 5 3-10 2 4h6" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="Alert Management">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94A2 2 0 0 0 22.18 18L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M12 9v4" strokeLinecap="round" strokeLinejoin="round"/>

            <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>



        <NavItem href="/dashboard" label="System Health">

          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">

            <path d="M12 2l7 4v6c0 5-4 9-7 10-3-1-7-5-7-10V6l7-4z" strokeLinecap="round" strokeLinejoin="round"/>

          </svg>

        </NavItem>

      </nav>



      <div className="p-4 text-xs text-gray-500 border-t">Version 1.0 • RockGuard</div>

    </aside>

  );

}