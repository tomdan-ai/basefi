import { Section, SectionHeading } from '@/components'
import { SOLUTION_POINTS } from '@/constant'
import { CheckCircle2 } from 'lucide-react'

const Solutions = () => {
  return (
    <Section id='solutions'>
      <div className='grid gap-12 md:grid-cols-2 items-center'>
        <div>
          <SectionHeading
            title='Our Solution'
            subtitle='USSD + Avalanche: Bringing crypto to feature phones'
          />

          <div className='mt-8 space-y-6'>
            {SOLUTION_POINTS.map((point, index) => (
              <div key={index} className='flex gap-4' data-aos="fade-up">
                <CheckCircle2 className='h-6 w-6 text-primary flex-shrink-0 mt-1' />
                <div>
                  <h3 className='font-semibold text-lg'>{point.title}</h3>
                  <p className='mt-1 text-muted-foreground'>
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='relative /h-[400px] rounded-lg overflow-hidden shadow-xl' data-aos="flip-up">
          <div className='absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 z-10 rounded-lg' />
          <img
            src='/hand-holding-phone-displaying-phonebook.jpg'
            alt='USSD interface on a feature phone'
            className='object-cover'
          />
        </div>
      </div>
    </Section>
  )
}

export default Solutions
