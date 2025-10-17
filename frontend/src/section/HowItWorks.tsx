import { Section, SectionHeading } from '@/components'
import { HOW_IT_WORKS_STEPS } from '@/constant'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const HowItWorks = () => {
  return (
    <Section id='how-it-works' className=''>
      <SectionHeading
        title='How It Works'
        centered
        subtitle='Learn how our platform operates'
      />
      <div className='grid gap-4  sm:grid-cols-2 lg:grid-cols-4 '>
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <StepCard
            key={step.title}
            number={index + 1}
            title={step.title}
            description={step.description}
            className=''
          />
        ))}
      </div>
    </Section>
  )
}

export default HowItWorks

interface StepCardProps {
  number: number
  title: string
  description: string
  className?: string
}

const StepCard = ({ number, title, description, className }: StepCardProps) => {
  return (
    <Card
      className={cn('h-full bg-primary-red/5 py-4', className)}
      data-aos='fade-up'
    >
      <CardHeader className='pb-1'>
        <div className='mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-red to-primary-blue text-white font-bold'>
          {number}
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-base'>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
