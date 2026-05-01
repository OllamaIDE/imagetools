import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Textarea from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const thankYouUrl = `${SITE_CONFIG.url}/thank-you`;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <SEOHead 
        title="Contact Us"
        description={`Get in touch with the ${SITE_CONFIG.name} team for support or feedback.`}
        canonical="/contact"
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
          Have questions or suggestions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-sm text-zinc-500">{SITE_CONFIG.contactEmail}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-zinc-50 rounded-lg text-zinc-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Support</h3>
              <p className="text-sm text-zinc-500">Available Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6">
              <form 
                action={`https://formsubmit.co/${SITE_CONFIG.contactEmail}`} 
                method="POST" 
                className="space-y-4"
              >
                {/* FormSubmit Configuration */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value={thankYouUrl} />
                <input type="hidden" name="_subject" value={`New Message from ${SITE_CONFIG.name} Contact Form`} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">Name</label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <Input id="email" type="email" name="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                  <Input id="subject" name="_subject_line" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="message">Message</label>
                  <Textarea id="message" name="message" placeholder="Describe your issue or feedback..." className="min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
