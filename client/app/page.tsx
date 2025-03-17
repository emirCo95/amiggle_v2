import Image from 'next/image';
import logo from '@/public/logo.png';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['400'],
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div className="w-auto mx-auto h-screen flex flex-col justify-center items-center gap-10">
      <div className="w-auto mx-auto flex justify-center items-center">
        <p className={`${inter.className} antialiased text-5xl text-wrap`}>
          Amiggle – Learn, Collaborate, Succeed! 🚀📚
        </p>
      </div>
      <Image src={logo} alt="logo" width={500} height={500} />
    </div>
  );
}
