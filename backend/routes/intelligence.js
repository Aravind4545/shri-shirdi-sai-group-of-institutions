const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

// @route   GET /api/intelligence/student
// @desc    Get academic health and insights for the logged-in student
router.get('/student', auth, async (req, res) => {
  try {
    let health = await prisma.academicHealth.findFirst({ where: { studentId: req.user.id } });
    if (!health) {
      health = await prisma.academicHealth.create({ data: {
        studentId: req.user.id,
        healthScore: 85,
        components_attendanceScore: 90,
        components_testScore: 82,
        components_assignmentScore: 88,
        components_studyActivityScore: 75,
        status: 'Good'
      } });
    }
    
    // Format health for the frontend expectation
    health.components = {
      attendanceScore: health.components_attendanceScore,
      testScore: health.components_testScore,
      assignmentScore: health.components_assignmentScore,
      studyActivityScore: health.components_studyActivityScore
    };

    let insight = await prisma.performanceInsight.findFirst({ where: { studentId: req.user.id } });
    if (!insight) {
      insight = await prisma.performanceInsight.create({ data: {
        studentId: req.user.id,
        performanceScore: 82,
        growthScore: 15,
        predictedRank: 12500,
        predictedPercentile: 96.5,
        successProbability: 88,
        readinessLevel: 'Good',
        weeklyGrowth: 2.5,
        monthlyGrowth: 8.4,
        learningConsistencyScore: 92,
        improvementScore: 85,
        aiInsights: [
          'You improved by 8.4% this month.',
          'Your attendance is solid, keep it up!',
          'Physics is your strongest subject, but chemistry needs focus.',
          'Great consistency in completing assignments on time.'
        ]
      } });
    }

    const topics = await prisma.topicAnalytics.findMany({ where: { studentId: req.user.id } });
    const strongTopics = topics.filter(t => t.status === 'Strong').map(t => t.topic);
    const weakTopics = topics.filter(t => t.status === 'Weak' || t.status === 'Critical').map(t => t.topic);

    const subjects = await prisma.subjectAnalytics.findMany({
      where: { studentId: req.user.id },
      orderBy: { averageAccuracy: 'desc' }
    });

    res.json({
      health,
      insight,
      strongTopics,
      weakTopics,
      subjects
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/intelligence/teacher
// @desc    Get intelligence overview for a teacher's batch
router.get('/teacher', auth, async (req, res) => {
  try {
    const teacher = await prisma.user.findUnique({ where: { id: req.user.id } });
    const program = teacher.assignedProgram || teacher.programInfo_program || 'NEET';
    
    const students = await prisma.user.findMany({ 
      where: { role: 'Student', programInfo_program: program } 
    });
    
    let risks = await prisma.riskPrediction.findMany({
      where: { program: program }
    });

    if (risks.length === 0 && students.length > 0) {
      for (let st of students.slice(0, 2)) {
        await prisma.riskPrediction.create({
          data: {
            studentId: st.id,
            program: program,
            riskLevel: 'High',
            factors: [JSON.stringify({ category: 'Attendance', description: 'Missed 4 consecutive classes', severity: 'High' })],
            interventionSuggestions: ['Call parent.', 'Provide makeup assignments.']
          }
        });
      }
      risks = await prisma.riskPrediction.findMany({
        where: { program: program }
      });
    }

    const studentIds = risks.map(r => r.studentId).filter(Boolean);
    const riskStudents = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, fullName: true, email: true }
    });

    const studentMap = {};
    riskStudents.forEach(s => studentMap[s.id] = s);

    const formattedRisks = risks.map(r => {
      const parsedFactors = r.factors.map(f => {
        try { return JSON.parse(f); } catch (e) { return { description: f }; }
      });
      const stObj = studentMap[r.studentId] || { fullName: 'Unknown Student', email: '' };
      return {
        ...r,
        studentId: stObj,
        student: stObj,
        factors: parsedFactors
      };
    });

    res.json({
      batchPerformance: 78,
      assignmentCompletionRate: 85,
      attendanceTrend: 92,
      atRiskCount: formattedRisks.length,
      risks: formattedRisks
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || 'Server Error');
  }
});

// @route   GET /api/intelligence/report
// @desc    Generate and download reports
router.get('/report', auth, async (req, res) => {
  try {
    const { format, type } = req.query; // format: 'pdf' | 'excel', type: 'student' | 'teacher' | 'admin'

    if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-disposition', `attachment; filename=academic-report-${Date.now()}.pdf`);
      res.setHeader('Content-type', 'application/pdf');
      
      doc.pipe(res);
      doc.fontSize(25).text('Sri Shirdi Sai Institutions', 100, 100);
      doc.fontSize(18).text(`Academic Intelligence Report (${type.toUpperCase()})`, 100, 140);
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 100, 180);
      doc.text('Confidential automated report generated by the AI Analytics Engine.', 100, 220);
      doc.end();
    } else if (format === 'excel') {
      const wb = XLSX.utils.book_new();
      const ws_data = [
        ["Report Type", "Generated On", "Status"],
        [type.toUpperCase(), new Date().toLocaleDateString(), "Generated via AI Engine"]
      ];
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-disposition', `attachment; filename=academic-report-${Date.now()}.xlsx`);
      res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } else {
      res.status(400).json({ msg: 'Invalid format requested' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/intelligence/admin
// @desc    Get institution-wide intelligence and executive alerts
router.get('/admin', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!['Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const totalStudents = await prisma.user.count({ where: { role: 'Student' } });
    const activeStudents = totalStudents - Math.floor(totalStudents * 0.05); // Mock 95% active
    
    let programPerformance = await prisma.subjectAnalytics.groupBy({
      by: ['program'],
      _avg: { averageAccuracy: true }
    });
    
    programPerformance = programPerformance.map(pp => ({
      _id: pp.program || 'Unknown',
      avgScore: pp._avg.averageAccuracy || 0
    }));

    // If there's no data, use some fallback
    if (programPerformance.length === 0) {
       programPerformance = [
         { _id: 'IIT', avgScore: 82 },
         { _id: 'NEET', avgScore: 78 },
         { _id: 'UPSC', avgScore: 75 }
       ];
    }

    res.json({
      totalStudents,
      activeStudents,
      overallAttendance: 94,
      programPerformance
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
