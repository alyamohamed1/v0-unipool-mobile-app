export default function SearchDriversLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEEEFF] via-[#7F7CAF] via-[#9FB4C7] to-[#9FB798] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#7F7CAF] font-roboto">Searching for drivers...</p>
      </div>
    </div>
  )
}
