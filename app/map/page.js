"use client"
import { useState } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/sidebar';
// import {useRouter} from 'next/navigation'
import styles from '../map.module.css';

export default function SidebarPage() {
  // const router = useRouter()
  return (

    <div>
      <Sidebar />



      <Map />

    </div>
  );
}
