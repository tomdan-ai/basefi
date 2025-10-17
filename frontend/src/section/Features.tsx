import { Section } from '@/components'
import { FEATURES } from '@/constant'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/Section'

const Features = () => {
  return (
    <Section id='features' fullWidth className='bg-primary-red/5'>
      <SectionHeading
        title='Features'
        subtitle='Explore the features of our platform'
        centered
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {FEATURES.map(feature => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon as LucideIcon}
            className='shadow-md'
          />
        ))}
      </div>
    </Section>
  )
}

export default Features

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className
}: FeatureCardProps) => {
  return (
    <Card className={cn('h-full shadow-none', className)} data-aos='fade-up'>
      <CardHeader>
        <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-primary-red to-primary-blue'>
          <Icon className='h-6 w-6 text-white' />
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-base'>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
