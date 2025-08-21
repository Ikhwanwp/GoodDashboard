// src/components/fulfillment/workflow-tracker.tsx
'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Check, Edit, FileText, Loader, Lock, Milestone } from "lucide-react";
import { Button } from '@/components/ui/button';
import { StepCompletionForm } from './step-completion-form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Step = {
    name: string;
    role: "GA" | "BA";
    status: "completed" | "active" | "pending";
};

type WorkflowTrackerProps = {
    steps: Step[];
    currentStepIndex: number;
    loggedInUserRole: "GA" | "BA";
};

export function WorkflowTracker({ steps, currentStepIndex, loggedInUserRole }: WorkflowTrackerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

    const handleStepClick = (index: number) => {
        setSelectedStepIndex(index);
        setIsModalOpen(true);
    };

    const getStatusIcon = (status: Step['status'], index: number) => {
        if (status === 'completed') return <Check className="h-5 w-5" />;
        if (status === 'active') return <Loader className="h-5 w-5 animate-spin" />;
        return <Milestone className="h-5 w-5" />;
    };

    const getStatusColor = (status: Step['status']) => {
        if (status === 'completed') return 'bg-primary text-primary-foreground';
        if (status === 'active') return 'bg-accent text-accent-foreground';
        return 'bg-muted text-muted-foreground';
    };

    const canUserEditStep = (step: Step) => {
        return step.role === loggedInUserRole;
    };
    
    return (
        <>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="relative flex items-center justify-between pb-2">
                    {steps.map((step, index) => (
                        <div key={index} className="flex-1 min-w-[120px] max-w-[150px] relative">
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleStepClick(index)}
                                    className={cn(
                                        "z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300",
                                        getStatusColor(step.status),
                                        step.status === 'active' && 'scale-110 shadow-lg',
                                        "hover:scale-110"
                                    )}
                                    disabled={step.status === 'pending' && index > currentStepIndex}
                                >
                                    {getStatusIcon(step.status, index)}
                                </button>
                                <div className="text-center">
                                    <p className="text-xs font-semibold">{step.name}</p>
                                    <p className="text-xs text-muted-foreground">PIC: {step.role}</p>
                                </div>
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "absolute top-5 left-1/2 w-full h-0.5",
                                    steps[index].status === 'completed' ? 'bg-primary' : 'bg-border'
                                )}></div>
                            )}
                        </div>
                    ))}
                </div>
                 <ScrollBar orientation="horizontal" />
            </ScrollArea>
             {selectedStepIndex !== null && (
                <StepCompletionForm 
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    step={steps[selectedStepIndex]}
                    isReadOnly={!canUserEditStep(steps[selectedStepIndex]) || steps[selectedStepIndex].status !== 'active'}
                />
            )}
        </>
    );
}
