import { Section, SectionHeading } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { BASE_BENEFITS } from '@/constant'

const WhyBase = () => {
  return (
    <Section id='why-base' className='bg-[#0052FF]/10' fullWidth>
      <SectionHeading
        title='Why Base?'
        centered
        subtitle='Powered by Coinbase - secure, fast, and cost-effective Ethereum L2'
      />

      <div className='grid gap-4 sm:grid-cols-2' data-aos='fade-up'>
        {BASE_BENEFITS.map((benefit, index) => (
          <Card key={index} className='p-4 shadow-none border-[#0052FF]/20'>
            <CardContent className='p-2'>
              <benefit.icon className='h-8 w-8 text-[#0052FF] mb-4' />
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

export default WhyBase
