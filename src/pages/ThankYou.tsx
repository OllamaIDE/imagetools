import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="max-w-xl mx-auto py-24 text-center space-y-8">
      <SEOHead 
        title="Thank You — Message Sent"
        description="Thank you for contacting us. We will get back to you shortly."
        canonical="/thank-you"
      />
      
      <div className="flex justify-center">
        <div className="p-4 bg-green-100 rounded-full text-green-600 animate-bounce">
          <CheckCircle className="h-16 w-16" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Message Sent!</h1>
        <p className="text-xl text-zinc-500">
          Thank you for reaching out. We've received your message and will get back to you as soon as possible.
        </p>
      </div>

      <div className="pt-8">
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
