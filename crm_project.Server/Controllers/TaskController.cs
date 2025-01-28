using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using TaskApi.Model;

namespace TaskApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private TaskContext _taskContext;

        public TaskController(TaskContext taskContext)
        {
            _taskContext = taskContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestTask>>> GetTasks()
        {
            return await _taskContext.Tasks.Select(x => x).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestTask>> GetTask(int id)
        {
            var task = await _taskContext.Tasks.SingleOrDefaultAsync(x => x.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, TaskRequest task)
        {
            var TaskItem = await _taskContext.Tasks.SingleOrDefaultAsync(task => task.Id == id);
            if (TaskItem == null)
            {
                return NotFound();
            }

            TaskItem.Title = task.Title;
            TaskItem.Description = task.Description;
            TaskItem.StartTime = task.StartTime;
            TaskItem.EndTime = task.EndTime;

            try
            {
                await _taskContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<TestTask>> PostTask(TaskRequest task)
        {
            var newTask = new TestTask
            {
                Id = Random.Shared.Next(),
                Title = task.Title,
                Description = task.Description,
                StartTime = task.StartTime,
                EndTime = task.EndTime
            };

            _taskContext.Tasks.Add(newTask);
            await _taskContext.SaveChangesAsync();

            return CreatedAtAction(nameof(PostTask), newTask.Id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var TaskItem = await _taskContext.Tasks.FindAsync(id);

            if (TaskItem == null)
            {
                return NotFound();
            }

            _taskContext.Tasks.Remove(TaskItem);
            await _taskContext.SaveChangesAsync();

            return Ok();
        }
    }
}