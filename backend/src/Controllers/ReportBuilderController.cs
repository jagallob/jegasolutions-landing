using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JEGASolutions.API.Services;
using JEGASolutions.API.Models.ReportBuilder;

namespace JEGASolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportBuilderController : ControllerBase
    {
        private readonly IReportBuilderService _reportBuilderService;

        public ReportBuilderController(IReportBuilderService reportBuilderService)
        {
            _reportBuilderService = reportBuilderService;
        }

        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
        {
            try
            {
                var reports = await _reportBuilderService.GetReportsAsync();
                return Ok(reports);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reports/{id}")]
        public async Task<IActionResult> GetReport(int id)
        {
            try
            {
                var report = await _reportBuilderService.GetReportAsync(id);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reports")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto request)
        {
            try
            {
                var result = await _reportBuilderService.CreateReportAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("reports/{id}")]
        public async Task<IActionResult> UpdateReport(int id, [FromBody] UpdateReportDto request)
        {
            try
            {
                var result = await _reportBuilderService.UpdateReportAsync(id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reports/{id}/generate")]
        public async Task<IActionResult> GenerateReport(int id)
        {
            try
            {
                var result = await _reportBuilderService.GenerateReportAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetTemplates()
        {
            try
            {
                var templates = await _reportBuilderService.GetTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("ai/generate-narrative")]
        public async Task<IActionResult> GenerateAINarrative([FromBody] GenerateNarrativeDto request)
        {
            try
            {
                var result = await _reportBuilderService.GenerateAINarrativeAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}


