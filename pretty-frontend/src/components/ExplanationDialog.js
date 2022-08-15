import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export default function ExplanationDialog({ showExplanation, setShowExplanation }) {
    let [isOpen, setIsOpen] = [showExplanation, setShowExplanation]

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as='div' className='relative z-30' onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black bg-opacity-25' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-jp-gray p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-lg font-medium leading-6 text-white'
                                    >
                                        How It Works
                                    </Dialog.Title>
                                    <div className='mt-2 text-white'>
                                        <p className='font-thin'>
                                            A file takes up a certain amount of bytes.
                                        </p>
                                        <p className='font-thin'>
                                            Since each transaction on chain is limited to a certain
                                            amount of bytes, the file must be split up.
                                        </p>
                                        <p className='font-thin'>
                                            This calculation is the first step to uploading a file.
                                        </p>
                                        <p className='font-thin'>
                                            A file is broken down into X number of parts.
                                        </p>
                                        <p className='font-thin'>
                                            Each part is an array 500 elements long, where each
                                            element is a 32 byte hex string.
                                        </p>
                                        <p className='font-thin'>
                                            Each part is then uploaded to the blockchain, using a
                                            2-dimensional array structure.
                                        </p>
                                    </div>

                                    <div className='mt-4'>
                                        <button
                                            type='button'
                                            className='inline-flex justify-center  border-transparent px-4 py-2 text-sm font-medium
                        pl-4 pr-4 pt-2 pb-2 rounded-xl border bg-jp-dark-blue
                                border-jp-light-blue hover:border-jp-light-blue text-jp-light-blue
                                '
                                            onClick={closeModal}
                                        >
                                            Got it, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
