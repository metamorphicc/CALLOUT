import { project } from './config/project'

export default function App() {
  return (
    <main>
      <p className="eyebrow">LOCAL DEVELOPMENT</p>
      <h1>{project.name}</h1>
      <p>Локальное окружение готово к разработке.</p>
      <p>Дизайн и секции сайта будут реализованы следующим этапом.</p>
    </main>
  )
}
