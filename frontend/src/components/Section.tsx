import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id: string
  fullWidth?: boolean
}
export const Section = ({
  children,
  className,
  id,
  fullWidth
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'flex flex-col items-center justify-center py-10 px-5 md:px-10 lg:px-20 pt-20',
        fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </section>
  )
}

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className
}: SectionHeadingProps) => {
  return (
    <div
      className={cn('mb-10 space-y-2', centered && 'text-center', className)}
      data-aos='zoom-in'
    >
      <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
        {title}
      </h2>
      {subtitle && (
        <p className='text-lg text-muted-foreground md:text-xl'>{subtitle}</p>
      )}
    </div>
  )
}
