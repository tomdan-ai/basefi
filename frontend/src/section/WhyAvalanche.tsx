import { Section, SectionHeading } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { AVALANCHE_BENEFITS } from '@/constant'

const WhyAvalanche = () => {
  return (
    <Section id='why-avalanche' className='bg-primary-blue/10' fullWidth>
      <SectionHeading
        title='Why Avalanche?'
        centered
        subtitle='Powered by one of the fastest, most reliable blockchain networks'
      />

      <div className='grid gap-4 sm:grid-cols-2' data-aos='fade-up'>
        {AVALANCHE_BENEFITS.map((benefit, index) => (
          <Card key={index} className='p-4 shadow-none'>
            <CardContent className='p-2'>
              <benefit.icon className='h-8 w-8 text-primary mb-4' />
              <h3 className='font-semibold text-lg'>{benefit.title}</h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export default WhyAvalanche
