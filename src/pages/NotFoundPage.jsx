import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-terminal">
      <div className="p-4 rounded-2xl bg-status-rose/10 border border-status-rose/30 text-status-rose mb-4">
        <AlertOctagon className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-black text-white">404 - SEGMENTATION FAULT</h1>
      <p className="text-xs text-aegis-muted max-w-md mt-2">
        The requested address space or kernel route does not exist in the Aegis scheduler directory.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Return to Overview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
