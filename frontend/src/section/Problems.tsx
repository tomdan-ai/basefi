import { Section, SectionHeading } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { PROBLEM_STATS } from '@/constant'

const Problems = () => {
  return (
    <Section id='problems ' className='bg-muted/30' fullWidth>
      <SectionHeading title='The Problems' centered />

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {PROBLEM_STATS.map((stat, index) => (
          <Card
            key={index}
            className='overflow-hidden border-none shadow-md'
            data-aos='zoom-in-up'
          >
            <CardContent className='p-6'>
              <div className='flex flex-col items-center text-center'>
                <div className='text-4xl font-bold bg-gradient-to-r from-primary-red to-primary-blue bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <p className='mt-2 text-muted-foreground'>{stat.label}</p>
                <p className='mt-4 text-sm'>{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className='mt-8 bg-gradient-to-r from-primary-red/10 to-primary-blue/10 rounded-lg p-6 md:p-8 '
        data-aos='fade-in-up'
      >
        <p className='text-lg'>
          Most crypto solutions require smartphones, internet access, and
          technical knowledge. But in many African countries, feature phones
          without internet are still the norm, and millions remain unbanked or
          underbanked.
        </p>
        <p className='mt-4 text-lg'>
          This creates a significant barrier to financial inclusion and crypto
          adoption, leaving a vast population unable to access the benefits of
          digital assets and decentralized finance.
        </p>
      </div>
    </Section>
  )
}

export default Problems
