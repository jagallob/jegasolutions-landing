using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JEGASolutions.API.Services;
using JEGASolutions.API.Models.GestorHorasExtra;

namespace JEGASolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GestorHorasExtraController : ControllerBase
    {
        private readonly IGestorHorasExtraService _gestorHorasExtraService;

        public GestorHorasExtraController(IGestorHorasExtraService gestorHorasExtraService)
        {
            _gestorHorasExtraService = gestorHorasExtraService;
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            try
            {
                var employees = await _gestorHorasExtraService.GetEmployeesAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("overtime-requests")]
        public async Task<IActionResult> GetOvertimeRequests()
        {
            try
            {
                var requests = await _gestorHorasExtraService.GetOvertimeRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("overtime-requests")]
        public async Task<IActionResult> CreateOvertimeRequest([FromBody] CreateOvertimeRequestDto request)
        {
            try
            {
                var result = await _gestorHorasExtraService.CreateOvertimeRequestAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("overtime-requests/{id}/approve")]
        public async Task<IActionResult> ApproveOvertimeRequest(int id)
        {
            try
            {
                var result = await _gestorHorasExtraService.ApproveOvertimeRequestAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reports/summary")]
        public async Task<IActionResult> GetOvertimeSummary()
        {
            try
            {
                var summary = await _gestorHorasExtraService.GetOvertimeSummaryAsync();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}


