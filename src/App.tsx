import Calculator from './Calculator'
import avatar from './assets/avatar.jpg'

function App() {
  return (
    <div className="flex flex-col w-full h-screen bg-slate-600 text-slate-200">
      <header className="flex w-ful justify-between px-10 pt-8">
        <div className="flex items-center h-10">
          <div className="w-12 h-12">
            <img className="rounded-full" src={avatar} alt="Avatar" />
          </div>
          <h1 className="text-2xl text-center pl-4">My new POC</h1>
        </div>

        <div className="flex gap-6">
          <a href="http://github.com/aiherrera" target="_blank">
            Github
          </a>
          <a href="http://aiherrera.com" target="_blank">
            Website
          </a>
          <a href="http://blog.aiherrera.com" target="_blank">
            Blog
          </a>
        </div>
      </header>

      <main className="flex w-full h-screen justify-center">
        <Calculator />
      </main>
    </div>
  )
}

export default App
