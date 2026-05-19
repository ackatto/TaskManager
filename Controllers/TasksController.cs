using Microsoft.AspNetCore.Mvc;

namespace TaskManager.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;

    public TasksController(ITaskRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var tasks = _repo.GetAll();
        return Ok(tasks);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var task = _repo.GetById(id);
        if (task == null)
            return NotFound();
        return Ok(task);
    }
   
    [HttpPost]
    public IActionResult Create([FromBody] TaskItem task)
    {
        _repo.Add(task);      
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] TaskItem task)
    {
        if (id != task.Id)
            return BadRequest("Id в URL и в теле не совпадают");

        var existing = _repo.GetById(id);
        if (existing == null)
            return NotFound();

        _repo.Update(task);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var task = _repo.GetById(id);
        if (task == null)
            return NotFound();

        _repo.Delete(id);
        return NoContent();
    }
}