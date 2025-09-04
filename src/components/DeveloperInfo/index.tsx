import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DeveloperData } from '@/types/interfaces';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DeveloperInfo: FC<{ developerData: DeveloperData }> = ({
  developerData,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          className="rounded-full cursor-pointer"
          src={developerData.image}
          width={50}
          height={50}
          alt="developer avatar"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Image
              className="rounded-full"
              src={developerData.image}
              width={100}
              height={100}
              alt="developer avatar"
            />
            <span className="flex gap-4 items-center">
              {developerData.name}
              <Link href={developerData.github} target="blank">
                <Image
                  src={'/icons/github-logo.png'}
                  width={25}
                  height={25}
                  alt="github logo"
                />
              </Link>
            </span>
          </DialogTitle>
          <DialogDescription>{developerData.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperInfo;
