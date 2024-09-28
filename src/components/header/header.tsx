"use client"
import React, { useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function Header() {
  const user = useUser();
  const auth = useAuth();
  const [isdark, setDark] = useState(true);

  useEffect(() => {
    const themesetter = document.getElementById('themesetter');

    if (localStorage.getItem('theme') === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }

    themesetter?.addEventListener('click', () => {
      if (isdark) {
        setDark(false);
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        setDark(true);
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });

    return () => {
      themesetter?.removeEventListener('click', () => {});
    };
  }, [isdark]);


    useEffect(() => {
        const loaderbar = document.getElementById('loaderbar');
    
        const startLoading = () => {
          if (loaderbar) {
            loaderbar.style.transition = 'none';
            loaderbar.style.width = '0%';
            setTimeout(() => {
              loaderbar.style.transition = 'width 0.5s ease';
              loaderbar.style.width = '100%';
            }, 50);
          }
        };
    
        const stopLoading = () => {
          if (loaderbar) {
            loaderbar.style.width = '100%';
            setTimeout(() => {
              loaderbar.style.transition = 'width 0.5s ease, opacity 0.5s ease';
              loaderbar.style.opacity = '0';
              setTimeout(() => {
                loaderbar.style.width = '0%';
                loaderbar.style.opacity = '1';
              }, 500);
            }, 200);
          }
        };
    
        Router.events.on('routeChangeStart', startLoading);
        Router.events.on('routeChangeComplete', stopLoading);
        Router.events.on('routeChangeError', stopLoading);
    
        return () => {
          Router.events.off('routeChangeStart', startLoading);
          Router.events.off('routeChangeComplete', stopLoading);
          Router.events.off('routeChangeError', stopLoading);
        };
      }, []);
    return(
        <>
        <div
            id="loaderbar"
            className="h-0.5 bg-blue-600 fixed top-0 left-0 z-50"
            style={{ width: '0%', opacity: 1 }}
        />
        <header className='w-full z-50  text-black backdrop-blur-lg border-b'>
            <div className='container mx-auto flex justify-between items-center py-4 px-4'>
                <div className='flex flex-row items-center gap-3'>
                    <Link href='/'>
                    {
                      isdark ? <img src="/darkScamStopper.png" className='w-[140px] h-auto' /> : <img src="/ScamStopper.png" className='w-[140px] h-auto' />
                    }
                    </Link>
                    <nav className='md:flex hidden flex-row items-end justify-end text-sm dark:text-white text-black'>
                        <Link href='/support'>
                            <div className='mx-2 hover:underline-offset-2 hover:underline'>Support</div>
                        </Link>
                        <Link href='/about'>
                            <div className='mx-2 hover:underline-offset-2 hover:underline'>About</div>
                        </Link>
                    </nav>
                </div>
                <div className='gap-2 flex'>
                    <Link href='/report-scam'>
                      <Button className=''>Report a Scam</Button>
                    </Link>
                    {user.user === null ? (
                      <>
                        <Link href='/sign-up'>
                          <Button variant="outline" className='dark:text-white text-black'>Sign up</Button>
                        </Link>
                        <Link href='/sign-in'>
                          <Button variant="outline" className='dark:text-white text-black'>Sign in</Button>
                        </Link>
                      </>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className='flex px-4'>
                            <img src={user.user?.imageUrl} className='w-8 h-8 rounded-full' />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link href='/profile'>
                              <div className='dark:text-white text-black'>Profile</div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href='/settings'>
                              <div className='dark:text-white text-black'>Settings</div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <div className='dark:text-white text-black' onClick={() => auth.signOut()}>Sign out</div>
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>

                    )
                    }
                    <div className='md:flex hidden cursor-pointer items-center text-black dark:text-white' id='themesetter'>
                      {
                        isdark ? <Sun size={22} /> : <Moon size={22} />
                      }
                    </div>
                </div>
            </div>
        </header>
        </>
    )
}